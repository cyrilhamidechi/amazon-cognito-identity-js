//Based on http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html


var S3_CONF = {
  bucketName: 'test-architecture'
};


var userFolder = null;
var userS3 = null;


function initBucket(folder) {
  userFolder = folder + '/';
  userS3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: S3_CONF.bucketName, Delimiter: '/', Prefix: userFolder}
  });
  document.getElementById('s3content').innerHTML = '';
}


function browse(folder) {
  if (!folder) {
    folder = userFolder;
  }
  folder = decodeURIComponent(folder);
  userS3.listObjects({Prefix: folder}, function (err, data) {
    if (err) {
      return alert('There was an error browsing [' + folder + ']: ' + err.message);
    }
    else {

      var folders = data.CommonPrefixes.map(function (commonPrefix) {
        var prefix = commonPrefix.Prefix;
        var folderName = prefix.replace(folder, '');
        var folderKey = encodeURIComponent(folder + folderName);
        return getHtml([
          '<li>',
          '<span onclick="deleteFolder(\'' + folderKey + '\')">X</span>',
          '<span onclick="browse(\'' + folderKey + '\')">[' + folderName + ']</span>',
          '</li>'
        ]);
      });

      var files = data.Contents.map(function (file) {
        var fileKey = file.Key;
        if (fileKey != folder) {
          return getHtml([
            '<li>',
            '<span onclick="deleteFile(\'' + encodeURIComponent(folder) + "','" + encodeURIComponent(fileKey) + '\')">X</span>[' + fileKey.replace(folder, '') + ']</span>',
            '</li>'
          ]);
        }
      });

      var foldersMsg = folders.length > 0 ?
        getHtml([
          '<p>Click on a folder name to browse it.</p>',
          '<p>Click on the X to delete a folder.</p>'
        ]) :
        '<p>No folders.';

      var filesMsg = files.length > 0 ? '<p>Click on the X to delete a file.</p>' : '<p>No files.';

      var navbar_parts = folder.split('/');
      var navbar = navbar_parts.map(function (nav, index) {
        var goto = [];
        for (var i = 0; i <= index; i++) {
          goto.push(navbar_parts[i]);
        }
        return '<a href="#" onclick="browse(\'' + encodeURIComponent(goto.join('/')) + '/\')">' + nav + '</a>';
      });

      var htmlTemplate = [
        '<hr />',
        navbar.join(' / '),
        '<hr />',
        '<h3>Folders</h3>',
        foldersMsg,
        '<ul>',
        getHtml(folders),
        '</ul>',
        '<hr />',
        '<h3>Files</h3>',
        filesMsg,
        '<ul>',
        getHtml(files),
        '</ul>',
        '<hr />',
        '<input id="fileupload" type="file">',
        '<button id="addfile" onclick="addFile(\'' + encodeURIComponent(folder) + '\')">',
        'Add file',
        '</button>',
        '<hr />',
        '<button onclick="createFolder(prompt(\'Enter folder name:\'), \'' + encodeURIComponent(folder) + '\')">',
        'Create new folder',
        '</button>'
      ];

      document.getElementById('s3content').innerHTML = getHtml(htmlTemplate);
    }
  });
}


function createFolder(folderName, intoFolder) {
  folderName = folderName.trim();
  if (!folderName) {
    return alert('Folder names must contain at least one non-space character.');
  }
  var folderKey = decodeURIComponent(intoFolder) + folderName + '/';
  userS3.headObject({Key: folderKey}, function (err, data) {
    if (!err) {
      return alert('Folder already exists.');
    }
    if (err.code !== 'NotFound') {
      return alert('There was an error creating your folder: ' + err.message);
    }
    userS3.putObject({Key: folderKey}, function (err, data) {
      if (err) {
        return alert('There was an error creating your folder: ' + err.message);
      }
      alert('Successfully created folder.');
      browse(folderKey);
    });
  });
}



function addFile(folderName) {
  var files = document.getElementById('fileupload').files;
  if (!files.length) {
    return alert('Please choose a file to upload first.');
  }

  var file = files[0];

  var fileKey = decodeURIComponent(folderName) + file.name;
  userS3.upload({
    Key: fileKey,
    Body: file
  }, function (err, data) {
    if (err) {
      return alert('There was an error uploading your file: ', err.message);
    }
    alert('Successfully uploaded file.');
    browse(folderName);
  });
}


function deleteFile(folderName, fileKey) {
  userS3.deleteObject({Key: decodeURIComponent(fileKey)}, function (err, data) {
    if (err) {
      return alert('There was an error deleting your file: ', err.message);
    }
    alert('Successfully deleted file.');
    browse(folderName);
  });
}


function deleteFolder(folderName) {
  folderName = decodeURIComponent(folderName)
  userS3.listObjects({Prefix: folderName}, function (err, data) {
    if (err) {
      return alert('There was an error deleting your folder: ', err.message);
    }
    var objects = data.Contents.map(function (object) {
      return {Key: object.Key};
    });
    userS3.deleteObjects({
      Delete: {Objects: objects, Quiet: true}
    }, function (err, data) {
      if (err) {
        return alert('There was an error deleting your folder: ', err.message);
      }
      alert('Successfully deleted folder.');
      var folders = folderName.split('/');
      browse(folderName.replace(folders[folders.length - 2] + '/', ''));
    });
  });
}
