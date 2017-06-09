import {React, ReactDOM} from "./lib/react.js";

import {userPool, CognitoIdentityCredentials, Config, appConfig} from "./lib/cognito-pool.js";


class UserPoolsCognityIdentityIntegrationForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    var cognitoUser = userPool.getCurrentUser();

    console.log('user: ' + cognitoUser);
    if (cognitoUser != null) {
        cognitoUser.getSession((err, result) => {
            if (result) {
                console.log('You are now logged in.');

                // Add the User's Id Token to the Cognito credentials login map.
                const endpoint = 'cognito-idp.' + Config.region + '.amazonaws.com/' + appConfig.IdentityPoolId;
                Config.credentials = new CognitoIdentityCredentials({
                    IdentityPoolId : appConfig.IdentityPoolId,
                    Logins : {
                        endpoint : result.getIdToken().getJwtToken()
                    }
                });
            }
        });
        //call refresh method in order to authenticate user and get new temp credentials
        Config.credentials.refresh((error) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Successfully logged!');
            }
        });
    }
  }

  render() {
    return (
        <div>
            <h3>17 - Integrating User Pools with Cognito Identity</h3>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<UserPoolsCognityIdentityIntegrationForm />, document.getElementById('userpoolscognityidentityintegration'));

