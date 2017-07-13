//Based on:
// - http://docs.aws.amazon.com/cognito/latest/developerguide/synchronizing-data.html
// - http://docs.aws.amazon.com/cognito/latest/developerguide/handling-callbacks.html

var CognitoSync = {
  identity: {
    IdentityId: null,
    IdentityPoolId: null
  },
  client: null,
  manager: null,
  htmlContainer: null,
  browsedDataset: null,
  init: function (identityId, identityPoolId, container) {
    CognitoSync.identity = {
      IdentityId: identityId,
      IdentityPoolId: identityPoolId
    };
    CognitoSync.client = new AWS.CognitoSync();
    CognitoSync.manager = new AWS.CognitoSyncManager();
    CognitoSync.htmlContainer = container;
  },
  listDatasets: function () {
    CognitoSync.browsedDataset = null;
    CognitoSync.manager.listDatasets(function (err, data) {
      if (err) {
        console.log(err);  // an error occurred
      }
      else {
        console.log(data);
        var names = [];
        //todo: investigate why properties cases change when object is passed to a method
        data.map(function (d) {
          console.log(d);
          names.push('<a href="#" onclick=\'CognitoSync.browseDataset(' + d + ');\'>' + d.datasetName + '</a>');
          names.push(' [<a href="#" onclick="CognitoSync.removeDataset(\'' + d.datasetName + '\');">X</a>]');
          names.push('<br />');
        });
        names.push('<input placeholder="new dataset name" onblur="CognitoSync.createDataset(this.value);"/>');
        CognitoSync.htmlContainer.fill(names);
      }
    });
  },
  browseDataset: function (datasetDetails) {
    console.log(datasetDetails);
    CognitoSync.browsedDataset = datasetDetails;
    var datasetName = datasetDetails.DatasetName;
    var datasetBrowsed = [];
    //todo: use htmlContainer buffer and flush
    datasetBrowsed.push('<h1>Browsing dataset [' + datasetName + ']</h1>');
    datasetBrowsed.push('<input value="' + datasetName + '" onblur="CognitoSync.updateDatasetName(this.value);"/>');
    datasetBrowsed.push(CognitoSync.htmlContainer.displayDetails(datasetDetails));
    datasetBrowsed.push('<hr />');
    var params = CognitoSync.identity;
    params.DatasetName = datasetName;
    CognitoSync.client.listRecords(params, function (err, data) {
      if (err) {
        console.log(err);  // an error occurred
        CognitoSync.listDatasets();
      }
      else {
//        console.log(data.Records);
        var idx = 0;
        data.Records.map(function (d) {
        console.log(d);
//          datasetBrowsed.push('<input id="syst-key' + idx + '" value="' + d.Key + '" onblur="CognitoSync.updateKey(this.value, $(\'syst-value' + idx + '\').value));"/>');
//          datasetBrowsed.push('<input id="syst-value' + idx + '" value="' + d.Value + '" onblur="CognitoSync.updateKey($(\'syst-key' + idx + '\').value), this.value);"/>');
//          datasetBrowsed.push(CognitoSync.htmlContainer.displayDetails(d));
          datasetBrowsed.push('<span>' + d.Key + ' => ' + d.Value + '</span>');
          datasetBrowsed.push('<br />');
          idx++;
        });
        datasetBrowsed.push('<input id="syst-newkey" placeholder="new key" onblur="CognitoSync.updateKey(this.value, $(\'syst-newvalue\').value);"/>');
        datasetBrowsed.push('<input id="syst-newvalue" placeholder="new value" onblur="CognitoSync.updateKey(, $(\'syst-newkey\').value, this.value);"/>');
      }
    });
    CognitoSync.htmlContainer.fill(datasetBrowsed);
  },
  createDataset: function (name) {
    console.log('Creating dataset: ' + name);
    //do stuff
    CognitoSync.listDatasets();
  },
  updateDatasetName: function (newName) {
    console.log('Renaming dataset: ' + CognitoSync.browsedDataset.datasetName + ' => ' + newName);
    //do stuff
    CognitoSync.browseDataset(CognitoSync.browsedDataset);
  },
  removeDataset: function (datasetName) {
    console.log('Renmoving dataset ' + datasetName);
    //do stuff
  },
  updateKey: function (key, value) {
    console.log('Writing [' + key + ' => ' + value + '] into [' + CognitoSync.browsedDataset.datasetName + ']');
    //do stuff
    CognitoSync.browseDataset(CognitoSync.browsedDataset);
  },
  updateValue: function (key, value) {
    console.log('Writing [' + key + ' => ' + value + '] into [' + CognitoSync.browsedDataset.datasetName + ']');
    //do stuff
  },
  removeData: function (key) {
    console.log('Removing [' + key + '] from [' + CognitoSync.browsedDataset.datasetName + ']');
    //do stuff
    CognitoSync.browseDataset(CognitoSync.browsedDataset);
  },
  synchronise: function () {
    //do stuff
  },
  datasetHandler: function (datasetName) {
    return CognitoSync.manager.openOrCreateDataset(datasetName, function (err, dataset) {
      if (err) {
        console.log(err);
        return {error: err};
      }
      return {
        get: dataset.get('myKey', function (err, value) {
          console.log('myRecord: ' + value);
        }),
        put: dataset.put('newKey', 'newValue', function (err, record) {
          console.log(record);
        }),
        remove: dataset.remove('oldKey', function (err, success) {
          console.log(success);
        }),
        synchronize: dataset.synchronize({
          onSuccess: function (dataset, newRecords) {
            console.log('Successfully synchronized ' + newRecords.length + ' new records ' + datasetName + '.');
            console.log(dataset);
          },
          onFailure: function (err) {
            console.log('Synchronization failed ' + datasetName + '.');
            console.log(err);
          },
          onConflict: function (dataset, conflicts, callback) {
            var resolved = [];

            for (var i = 0; i < conflicts.length; i++) {

              // Take remote version.
              resolved.push(conflicts[i].resolveWithRemoteRecord());

              // Or... take local version.
              // resolved.push(conflicts[i].resolveWithLocalRecord());

              // Or... use custom logic.
              // var newValue = conflicts[i].getRemoteRecord().getValue() + conflicts[i].getLocalRecord().getValue();
              // resolved.push(conflicts[i].resovleWithValue(newValue);

            }

            dataset.resolve(resolved, function () {
              return callback(true);
            });

            // Or... callback false to stop the synchronization process.
            // return callback(false);
          },
          onDatasetDeleted: function (dataset, datasetName, callback) {
            // Return true to delete the local copy of the dataset.
            // Return false to handle deleted datasets outside the synchronization callback.

            return callback(true);
          },
          onDatasetMerged: function (dataset, datasetNames, callback) {
            // Return true to continue the synchronization process.
            // Return false to handle dataset merges outside the synchronization callback.

            return callback(false);
          }
        })
      }
    });
  }
}