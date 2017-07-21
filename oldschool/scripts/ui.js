var UI = {
  init: function () {

    var options = [];
    options.push('<option value="-1"> - choose a presets - </option>');
    USERS_CREDS.map(function (user, idx) {
      options.push('<option value="' + idx + '">' + user.label + '</option>');
    });
    $('login-presets').innerHTML = options.join('');

    var apis = [];
    apis.push('dropdown POST / PUT / DELETE');
    var headers = null;
    API_ENDPOINTS.map(function (api, idx) {
      headers = null;
      if(api.form) {
        switch(api.form) {
          case 'dynamodb':
            apis.push('dynamodb demo form to POST / PUT / DELETE');
            break;
        }
      } else {
        apis.push('<a id="logout" href="#" onclick="API.request(\'GET\',\'' + api.url + '\', ' + api.auth + ');">' + api.label + '</a>');
      }
    });
    $('api-demo').innerHTML = apis.join('<br />');

  },
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
    if (CognitoSync.manager) {
      CognitoSync.init(HtmlContainer.init('syncContent'));
      return true;
    }
    Cognito.loadMyDetails(function () {
      CognitoSync.init(HtmlContainer.init('syncContent'));
    });
  },
  displayCog: function () {
    Cognito.getMyDetails();
    UI.hide('sync');
    UI.hide('s3');
    UI.show('cog');
  },
  loadLoginPreset: function (preset) {
    if (preset < 0 || preset > USERS_CREDS.length) {
      return false;
    }
    var user = USERS_CREDS[preset];
    $('login').value = user.login;
    $('pwd').value = user.pwd;
    Cognito.logIn();
  },
  showLoggedMenu: function () {
    UI.hide('logme');
    UI.show('displayS3');
    UI.show('displaySync');
    UI.show('mydetails');
    UI.show('logout');
    UI.displayCog();
    UI.show('curtain');
  },
  hideLoggedMenu: function () {
    UI.showLoginActions();
    UI.show('logme');
    UI.hide('displayS3');
    UI.hide('displaySync');
    UI.hide('s3');
    UI.hide('sync');
    UI.hide('mydetails');
    UI.hide('logout');
  },
  showLoginForm: function () {
    UI.hideLoggedMenu();
  },
  showLoginActions: function () {
    UI.show('login-button');
    UI.show('login-presets');
    UI.hide('login-inprogress');
  },
  hideLoginActions: function () {
    UI.hide('login-button');
    UI.hide('login-presets');
    UI.show('login-inprogress');
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

