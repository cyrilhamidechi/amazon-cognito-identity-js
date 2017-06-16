//Based on http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html

var S3 = {
  CONF: {
    bucketName: 'test-architecture'
  },
  folder: null,
  client: null,
  htmlContainer: null,
  init: function (folder, container) {
    S3.htmlContainer = container;
    S3.folder = folder + '/';
    S3.client = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: S3.CONF.bucketName, Delimiter: '/', Prefix: S3.folder}
    });
  },
  browse: function (folder) {
    if (!folder) {
      folder = S3.folder;
    }
    folder = decodeURIComponent(folder);
    S3.client.listObjects({Prefix: folder}, function (err, data) {
      if (err) {
        return alert('There was an error browsing [' + folder + ']: ' + err.message);
      }
      else {

        var folders = data.CommonPrefixes.map(function (commonPrefix) {
          var prefix = commonPrefix.Prefix;
          var folderName = prefix.replace(folder, '');
          var folderKey = encodeURIComponent(folder + folderName);
          return '<li><span onclick="S3.deleteFolder(\'' + folderKey + '\')">X</span><span onclick="S3.browse(\'' + folderKey + '\')">[' + folderName + ']</span></li>';
        });

        var files = data.Contents.map(function (file) {
          var fileKey = file.Key;
          if (fileKey != folder) {
            return '<li><span onclick="S3.deleteFile(\'' + encodeURIComponent(folder) + "','" + encodeURIComponent(fileKey) + '\')">X</span>[' + fileKey.replace(folder, '') + ']</span></li>';
          }
        });

        var foldersMsg = folders.length > 0
          ? '<p>Click on a folder name to browse it.</p><p>Click on the X to delete a folder.</p>'
          : '<p>No folders.';

        var filesMsg = files.length > 0 ? '<p>Click on the X to delete a file.</p>' : '<p>No files.';

        var navbar_parts = folder.split('/');
        var navbar = navbar_parts.map(function (nav, index) {
          var goto = [];
          for (var i = 0; i <= index; i++) {
            goto.push(navbar_parts[i]);
          }
          return '<a href="#" onclick="S3.browse(\'' + encodeURIComponent(goto.join('/')) + '/\')">' + nav + '</a>';
        });

        S3.htmlContainer.fill([
          '<hr />' + navbar.join(' / '),
          '<hr /><h3>Folders</h3>',
          foldersMsg,
          '<ul>' + folders.join('') + '</ul>',
          '<hr /><h3>Files</h3>',
          filesMsg,
          '<ul>' + files.join('') + '</ul>',
          '<hr /><input id="fileupload" type="file">',
          '<button id="addfile" onclick="S3.addFile(\'' + encodeURIComponent(folder) + '\')">Add file</button>',
          '<hr /><button onclick="S3.createFolder(prompt(\'Enter folder name:\'), \'' + encodeURIComponent(folder) + '\')">Create new folder</button>'
        ]);
      }
    });
  },
  createFolder: function (folderName, intoFolder) {
    folderName = folderName.trim();
    if (!folderName) {
      return alert('Folder names must contain at least one non-space character.');
    }
    var folderKey = decodeURIComponent(intoFolder) + folderName + '/';
    S3.client.headObject({Key: folderKey}, function (err, data) {
      if (!err) {
        return alert('Folder already exists.');
      }
      if (err.code !== 'NotFound') {
        return alert('There was an error creating your folder: ' + err.message);
      }
      S3.client.putObject({Key: folderKey}, function (err, data) {
        if (err) {
          return alert('There was an error creating your folder: ' + err.message);
        }
        S3.browse(folderKey);
      });
    });
  },
  addFile: function (folderName) {
    var files = document.getElementById('fileupload').files;
    if (!files.length) {
      return alert('Please choose a file to upload first.');
    }

    var file = files[0];

    var fileKey = decodeURIComponent(folderName) + file.name;
    S3.client.upload({
      Key: fileKey,
      Body: file
    }, function (err, data) {
      if (err) {
        return alert('There was an error uploading your file: ', err.message);
      }
      S3.browse(folderName);
    });
  },
  deleteFile: function (folderName, fileKey) {
    S3.client.deleteObject({Key: decodeURIComponent(fileKey)}, function (err, data) {
      if (err) {
        return alert('There was an error deleting your file: ', err.message);
      }
      S3.browse(folderName);
    });
  },
  deleteFolder: function (folderName) {
    folderName = decodeURIComponent(folderName)
    S3.client.listObjects({Prefix: folderName}, function (err, data) {
      if (err) {
        return alert('There was an error deleting your folder: ', err.message);
      }
      var objects = data.Contents.map(function (object) {
        return {Key: object.Key};
      });
      S3.client.deleteObjects({
        Delete: {Objects: objects, Quiet: true}
      }, function (err, data) {
        if (err) {
          return alert('There was an error deleting your folder: ', err.message);
        }
        var folders = folderName.split('/');
        S3.browse(folderName.replace(folders[folders.length - 2] + '/', ''));
      });
    });
  }
}
