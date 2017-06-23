var CognitoSync = {
  identity: {
    IdentityId: null,
    IdentityPoolId: null
  },
  client: new AWS.CognitoSync(),
//  manager: new AWS.CognitoSyncManager(),
  init: function (identityId, identityPoolId) {
    CognitoSync.identity.IdentityId = identityId;
    CognitoSync.identity.IdentityPoolId = identityPoolId;
  },
  listDatasets: function () {
    console.log(CognitoSync.identity);
    CognitoSync.client.listDatasets(CognitoSync.identity, function(err, data) {
      if (err) console.log(err); // an error occurred
      else     console.log(data);           // successful response
    });
  },
  datasetHandler: function (datasetName) {
    return CognitoSync.client.openOrCreateDataset(datasetName, function (err, dataset) {
      if(err) {
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
            console.log('Successfully synchronized ' + newRecords.length + ' new records.');
          },
          onFailure: function (err) {
            console.log('Synchronization failed.');
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