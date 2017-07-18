//Based on:
// - https://github.com/aws/amazon-cognito-js
// - http://docs.aws.amazon.com/cognito/latest/developerguide/synchronizing-data.html
// - http://docs.aws.amazon.com/cognito/latest/developerguide/handling-callbacks.html

var CognitoSync = {
  MIN_LENGTH: 1,
  manager: null,
  htmlContainer: null,
  browsedDataset: null,
  init: function (container) {
    CognitoSync.manager = new AWS.CognitoSyncManager();
    CognitoSync.htmlContainer = container;
  },
  listDatasets: function (datasets) {
    if(datasets) {
      datasets.map(function(name) {
        CognitoSync.synchronize(name.trim());
      });
    }
    CognitoSync.browsedDataset = null;
    CognitoSync.manager.listDatasets(function (err, data) {
      console.log(data);
      if (err) {
        console.log(err);  // an error occurred
      }
      else {
        var names = [];
        //todo: investigate why properties cases change when object is passed to a method
        data.map(function (d) {
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
    CognitoSync.browsedDataset = datasetDetails;
    var datasetName = datasetDetails.DatasetName;
    var datasetBrowsed = [];
    datasetBrowsed.push('<h1>Browsing dataset [' + datasetName + ']</h1>');
    datasetBrowsed.push('<input value="' + datasetName + '" onblur="CognitoSync.updateDatasetName(this.value);"/>');
    datasetBrowsed.push('<input type="button" value="synchronize" onclick="CognitoSync.synchronize();"/>');
    datasetBrowsed.push(CognitoSync.htmlContainer.displayDetails(datasetDetails));
    datasetBrowsed.push('<hr />');

    CognitoSync.workOnDataset(datasetName, function (dataset) {
      dataset.getAllRecords(function (err, data) {
        if (err) {
          console.log(err);
          CognitoSync.listDatasets();
          return;
        }
        var idx = 0;
        data.map(function (d) {
          datasetBrowsed.push('<input id="syst-key' + idx + '" value="' + d.key + '"/>');
          datasetBrowsed.push('<input id="syst-value' + idx + '" value="' + d.value + '"/>');
          datasetBrowsed.push('<input type="button" value="set" onclick="CognitoSync.putData($(\'syst-key' + idx + '\').value, $(\'syst-value' + idx + '\').value);"/>');
          datasetBrowsed.push('<input type="button" value="X" onclick="CognitoSync.removeData($(\'syst-key' + idx + '\').value);"/>');
          datasetBrowsed.push(CognitoSync.htmlContainer.displayDetails(d));
          datasetBrowsed.push('<br />');
          idx++;
        });
        datasetBrowsed.push('<input id="syst-newkey" placeholder="new key"/>');
        datasetBrowsed.push('<input id="syst-newvalue" placeholder="new value"/>');
        datasetBrowsed.push('<input type="button" value="add" onclick="CognitoSync.putData($(\'syst-newkey\').value, $(\'syst-newvalue\').value);"/>');
        CognitoSync.htmlContainer.fill(datasetBrowsed);
      });
    });
  },
  createDataset: function (name) {
    name = name.trim();
    if (name.length < CognitoSync.MIN_LENGTH) {
      return;
    }
    console.log('Creating dataset: ' + name);
    CognitoSync.workOnDataset(name, function (dataset) {
      console.log(dataset);
    });
  },
  //TODO
  updateDatasetName: function (newName) {
    console.log('Renaming dataset: ' + CognitoSync.browsedDataset.DatasetName + ' => ' + newName);
    //do stuff
    CognitoSync.browseDataset(CognitoSync.browsedDataset);
  },
  //TODO
  removeDataset: function (datasetName) {
    console.log('Removing dataset ' + datasetName);
    //do stuff
  },
  putData: function (key, value) {
    key = key.trim();
    if (key.length < CognitoSync.MIN_LENGTH) {
      return;
    }
    var datasetName = CognitoSync.browsedDataset.DatasetName;
    console.log('Writing [' + key + ' => ' + value + '] into [' + datasetName + ']');
    CognitoSync.workOnDataset(datasetName, function (dataset) {
      dataset.put(key, value, function (err, data) {
        CognitoSync.workOnKey(err, data);
      });
    });
  },
  removeData: function (key) {
    key = key.trim();
    if (key.length < CognitoSync.MIN_LENGTH) {
      return;
    }
    var datasetName = CognitoSync.browsedDataset.DatasetName;
    console.log('Removing [' + key + '] from [' + datasetName + ']');
    CognitoSync.workOnDataset(datasetName, function (dataset) {
      dataset.remove(key, function (err, data) {
        CognitoSync.workOnKey(err, data);
      });
    });
  },
  synchronize: function (datasetName) {
    if(!datasetName && CognitoSync.browsedDataset) {
      datasetName = CognitoSync.browsedDataset.DatasetName;
    }
    if(!datasetName) {
      return;
    }
    console.log('Synchronizing dataset [' + datasetName + ']');
    CognitoSync.workOnDataset(datasetName, function (dataset) {
//      dataset.synchronize();
      dataset.synchronize({
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
      });
    });
  },
  workOnDataset: function (datasetName, successCase, errorCase, always) {
    CognitoSync.manager.openOrCreateDataset(datasetName, function (err, dataset) {
      if (err) {
        var error = errorCase;
        if (!error) {
          error = function (err) {
            console.log(err);
            CognitoSync.listDatasets();
            return;
          };
        }
        error(err);
      }
      else {
        if (successCase) {
          successCase(dataset);
        }
      }
      if (always) {
        always(err, dataset);
      }
    });
  },
  workOnKey: function (err, data) {
    if (err) {
      console.log(err);
    }
    if (CognitoSync.browsedDataset) {
      CognitoSync.browseDataset(CognitoSync.browsedDataset);
    }
    else {
      CognitoSync.listDatasets();
    }
  }
}