var UI = {
  displayS3: function () {
    UI.hide('sync');
    UI.hide('cog');
    UI.show('s3');
    Cognito.loadMyDetails(function () {
      S3.init(AWS.config.credentials.identityId, HtmlContainer.init('s3content'));
      S3.browse();
    });
  },
  displaySync: function () {
    UI.show('sync');
    UI.hide('s3');
    UI.hide('cog');
    if(CognitoSync.manager) {
      CognitoSync.listDatasets();
      return true;
    }
    Cognito.loadMyDetails(function () {
      CognitoSync.init(HtmlContainer.init('syncContent'));
      CognitoSync.listDatasets();
    });
  },
  displayCog: function () {
    Cognito.getMyDetails();
    UI.hide('sync');
    UI.hide('s3');
    UI.show('cog');
  },
  showLoggedMenu: function () {
    UI.hide('logme');
    UI.hide('loadsession');
    UI.show('displayS3');
    UI.show('displaySync');
    UI.show('mydetails');
    UI.show('logout');
    UI.displayCog();
    UI.show('curtain');
  },
  hideLoggedMenu: function () {
    UI.show('signin');
    UI.hide('signin-inprogress');
    UI.show('logme');
    UI.show('loadsession');
    UI.hide('displayS3');
    UI.hide('displaySync');
    UI.hide('s3');
    UI.hide('sync');
    UI.hide('mydetails');
    UI.hide('logout');
  },
  showLoginForm: function () {
    $('login').value = USER_CREDS.login;
    $('pwd').value = USER_CREDS.pwd;
    UI.hideLoggedMenu();
  },
  show: function (id) {
    UI.toggleDisplay(id, 'inline');
  },
  hide: function (id) {
    UI.toggleDisplay(id, 'none');
  },
  toggleDisplay: function (id, display) {
    $(id).style.display = display;
  }
}

