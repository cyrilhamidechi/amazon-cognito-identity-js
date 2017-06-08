// Use case 3.
// Resending a confirmation code via SMS for confirming registration for a unauthenticated user.

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
    cognitoUser.resendConfirmationCode({
        onSuccess: function (result) {
            console.log('call result: ' + result);
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
        <input type="submit"/>
      </form>
    );
  }
}

ReactDOM.render(<ResendConfirmationForm />, document.getElementById('resendconfirmation'));

