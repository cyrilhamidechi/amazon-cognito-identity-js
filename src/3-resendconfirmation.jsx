import {React, ReactDOM} from "./lib/react.js";

import {userPool} from "./lib/cognito-pool.js";
import {CognitoUser} from "./lib/cognito-user.js";


class ResendConfirmationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    };
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    var userData = {
        Username : this.state.username.trim(),
        Pool : userPool
    };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.resendConfirmationCode(function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        console.log('call result: ' + result);
    });
  }

  render() {
    return (
        <div>
            <h3>3 - Resending confirmation</h3>
            <small>Resending a confirmation code via SMS for confirming registration for a unauthenticated user.</small>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="text"
                     value={this.state.username}
                     placeholder="Username"
                     onChange={this.handleUsernameChange.bind(this)}/>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<ResendConfirmationForm />, document.getElementById('resendconfirmation'));

