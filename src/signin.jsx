// Use case 4.
// Authenticating a user and establishing a user session with the Amazon Cognito Identity service.

import {userPool, CognitoIdentityCredentials, Config, appConfig} from "./lib/cognito-pool.js";
import {CognitoUserAttribute, CognitoUser, AuthenticationDetails} from "./lib/cognito-user.js";
import {React, ReactDOM} from "./lib/react.js";


class SignInForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    const username = this.state.username.trim();
    const password = this.state.password.trim();
    var userData = {
        Username : username,
        Pool : userPool
    };
    var cognitoUser = new CognitoUser(userData);
    var authenticationData = {
        Username : username,
        Password : password,
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());

            const endpoint = 'cognito-idp.' + Config.region + '.amazonaws.com/' + appConfig.IdentityPoolId;
            Config.credentials = new CognitoIdentityCredentials({
                IdentityPoolId : appConfig.IdentityPoolId,
                Logins : {
                    // Change the key below according to the specific region your user pool is in.
                    endpoint : result.getIdToken().getJwtToken()
                }
            });

            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();

        },

        onFailure: function(err) {
            alert(err);
        },

    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="text"
               value={this.state.username}
               placeholder="Username"
               onChange={this.handleUsernameChange.bind(this)}/>
        <input type="password"
               value={this.state.password}
               placeholder="Password"
               onChange={this.handlePasswordChange.bind(this)}/>
        <input type="submit"/>
      </form>
    );
  }
}

ReactDOM.render(<SignInForm />, document.getElementById('signin'));

