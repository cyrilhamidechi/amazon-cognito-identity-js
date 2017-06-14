import {React, ReactDOM} from "./lib/react.js";

import {userPool, CognitoIdentityCredentials, Config, appConfig} from "./lib/cognito-pool.js";


class GetUserFromLocalForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    var cognitoUser = userPool.getCurrentUser();

    console.log('user: ' + cognitoUser);
     if (cognitoUser != null) {
         cognitoUser.getSession((err, session) => {
             if (err) {
                 alert(err);
                 return;
             }
             console.log('session validity: ' + session.isValid());

             // NOTE: getSession must be called to authenticate user before calling getUserAttributes
             cognitoUser.getUserAttributes((err, attributes) => {
                if (err) {
                  alert(err);
                  return;
                }
                console.log('attributes: ' + attributes);
                for (i = 0; i < attributes.length; i++) {
                  console.log('attribute ' + attributes[i].getName() + ' has value ' + attributes[i].getValue());
                }
             });

            // Change the key below according to the specific region your user pool is in.
/*            const endpoint = 'cognito-idp.' + Config.region + '.amazonaws.com/' + appConfig.IdentityPoolId;
            Config.credentials = new CognitoIdentityCredentials({
                IdentityPoolId : appConfig.IdentityPoolId,
                Logins : {
                    endpoint : result.getIdToken().getJwtToken()
                }
            });*/

             // Instantiate aws sdk service objects now that the credentials have been updated.
             // example: var s3 = new AWS.S3();

         });
     }
  }

  render() {
    return (
        <div>
            <h3>16 - Get user from local storage</h3>
            <small>Retrieving the current user from local storage.</small>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<GetUserFromLocalForm />, document.getElementById('getuserfromlocal'));

