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
    cognitoUser.confirmRegistration(this.state.code.trim(), true, (err, result) => {
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
            <h3>2 - Confirm registration</h3>
            <small>Confirming a registered, unauthenticated user using a confirmation code received via SMS.</small>
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
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<ConfirmRegistrationForm />, document.getElementById('confirmregistration'));

