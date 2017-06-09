import {React, ReactDOM} from "./lib/react.js";

import {userPool, CognitoIdentityCredentials, Config, appConfig} from "./lib/cognito-pool.js";
import {CognitoUserAttribute, CognitoUser, AuthenticationDetails} from "./lib/cognito-user.js";


class SignInForcedChangePwdForm extends React.Component {
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
            // User authentication was successful
        },

        onFailure: function(err) {
            // User authentication was not successful
        },

        mfaRequired: function(codeDeliveryDetails) {
            // MFA is required to complete user authentication.
            // Get the code from user and call
            cognitoUser.sendMFACode(mfaCode, this)
        },

        newPasswordRequired: function(userAttributes, requiredAttributes) {
            // User was signed up by an admin and must provide new
            // password and required attributes, if any, to complete
            // authentication.

            // the api doesn't accept this field back
            delete userAttributes.email_verified;

            // Get these details and call
            cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
        }
    });
  }

  render() {
    return (
        <div>
            <h3>23 - Set new password for a user created by an admin</h3>
            <small>Authenticate a user and set new password for a user that was created using AdminCreateUser API.</small>
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
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<SignInForcedChangePwdForm />, document.getElementById('signinforcedchangepwd'));

