import {React, ReactDOM} from "./lib/react.js";

import {userPool, CognitoIdentityCredentials, Config, appConfig} from "./lib/cognito-pool.js";
import {CognitoUserAttribute, CognitoUser, AuthenticationDetails} from "./lib/cognito-user.js";


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
        onSuccess: (result) => {
            console.log('access token + ' + result.getAccessToken().getJwtToken());

            // Change the key below according to the specific region your user pool is in.
console.log(Config.Endpoint);
            Config.credentials = new CognitoIdentityCredentials({
                IdentityPoolId : appConfig.IdentityPoolId,
                Logins : {
                    endpoint : result.getIdToken().getJwtToken()
                }
            });

            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();

        },

        onFailure: (err) => {
            alert(err);
        },

    });
  }

  render() {
    return (
        <div>
            <h3>4 - Sign in</h3>
            <small>
                Authenticating a user and establishing a user session with the Amazon Cognito Identity service.
                <br />Note that if device tracking is enabled for the user pool with a setting that user opt-in is required, you need to implement an onSuccess(result, userConfirmationNecessary) callback, collect user input and call either setDeviceStatusRemembered to remember the device or setDeviceStatusNotRemembered to not remember the device.
                <br />Note also that if CognitoUser.authenticateUser throws ReferenceError: navigator is not defined when running on Node.js, follow the instructions on the following Stack Overflow post.
            </small>
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

ReactDOM.render(<SignInForm />, document.getElementById('signin'));

