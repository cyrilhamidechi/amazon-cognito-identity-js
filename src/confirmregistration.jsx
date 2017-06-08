// Use case 2.
// Confirming a registered, unauthenticated user using a confirmation code received via SMS.

import {React, ReactDOM} from "./lib/react.js";

import {userPool} from "./lib/cognito-pool.js";
import {CognitoUser} from "./lib/cognito-user.js";


class ConfirmRegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      username: ''
    };
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handleCodeChange(e) {
    this.setState({code: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    var userData = {
        Username : this.state.username.trim(),
        Pool : userPool
    };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(this.state.code.trim(), true, {
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
        <input type="text"
               value={this.state.code}
               placeholder="SMS code"
               onChange={this.handleCodeChange.bind(this)}/>
        <input type="submit"/>
      </form>
    );
  }
}

ReactDOM.render(<ConfirmRegistrationForm />, document.getElementById('confirmregistration'));

