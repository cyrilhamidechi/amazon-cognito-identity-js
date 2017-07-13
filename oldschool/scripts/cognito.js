var Cognito = {
  CONF: {
    region: 'eu-west-1',
    IdentityPoolId: 'eu-west-1:09cfb9bc-86cf-4aa2-8c0b-dc69614e9527',
    UserPoolId: 'eu-west-1_9JBYfxf8r',
    ClientId: '7328r336bblcg28s42hau13u6c'
  },
  user: null,
  userDetails: null,
  htmlContainer: null,
  initContext: function () {

    Cognito.user = null;
    Cognito.UserDetails = null;
    AWS.config.region = Cognito.CONF.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: Cognito.CONF.IdentityPoolId
    });
    UI.hide('s3');
    HtmlContainer.init('s3content');
    UI.hide('sync');
    HtmlContainer.init('syncContent');
    UI.hide('cog');
    Cognito.htmlContainer = HtmlContainer.init('cogcontent');
  },
  loadSession: function () {

    UI.hide('loadsession');

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool({
      UserPoolId: Cognito.CONF.UserPoolId,
      ClientId: Cognito.CONF.ClientId
    });
    Cognito.user = userPool.getCurrentUser();

    if (!Cognito.user) {
      UI.showLoginForm();
      UI.show('curtain');
    }
    else {
      Cognito.user.getSession(function (err, session) {
        if (err) {
          alert(err);
          return;
        }

        Cognito.setCreds(session.idToken.jwtToken);

      });
    }

  },
  signIn: function () {

    var login = $('login').value.trim();
    var pwd = $('pwd').value.trim();
    if (login.length < 8 || pwd.length < 6) {
      return;
    }

    UI.hide('signin');
    UI.show('signin-inprogress');

    Cognito.user = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
      Username: USER_CREDS.login,
      Pool: new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool({
        UserPoolId: Cognito.CONF.UserPoolId,
        ClientId: Cognito.CONF.ClientId
      })
    });

    Cognito.user.authenticateUser(new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails({
      Username: login,
      Password: pwd
    }), {
      onSuccess: function (result) {
        Cognito.setCreds(result.getIdToken().getJwtToken());
      },
      onFailure: function (err) {
        alert("Error:" + err);
      }
    });

  },
  getMyDetails: function () {

    Cognito.loadMyDetails(function () {
      var details = [];
      details.push('<ul>');
      for (i = 0; i < Cognito.userDetails.length; i++) {
        details.push('<li>' + Cognito.userDetails[i].getName() + ' => ' + Cognito.userDetails[i].getValue() + '</li>');
      }
      details.push('</ul>');
      Cognito.htmlContainer.fill(details);
    });
  },
  loadMyDetails: function (callback) {

    Cognito.user.getUserAttributes(function (err, result) {

      if (err) {
        UI.hideLoggedMenu();
        alert(err);
        return;
      }

      Cognito.userDetails = result;

      if (callback) {
        callback();
      }

    });

  },
  logout: function () {

    UI.hide('logout');

    if (Cognito.user) {
      Cognito.user.signOut();
    }

    Cognito.initContext();
    Cognito.isLogged();

  },
  setCreds: function (jwtToken) {

    var logins = {};
    logins['cognito-idp.' + Cognito.CONF.region + '.amazonaws.com/' + Cognito.CONF.UserPoolId] = jwtToken;

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: Cognito.CONF.IdentityPoolId,
      Logins: logins
    });

    Cognito.isLogged();

  },
  isLogged: function () {

    if (!AWS.config.credentials || !Cognito.user) {
      UI.hideLoggedMenu();
      return;
    }

    AWS.config.credentials.refresh(function (err, result) {
      console.log(err);
      if (err) {
        UI.hideLoggedMenu();
        alert(err);
        return;
      }
      UI.showLoggedMenu();
    });

  }
}
