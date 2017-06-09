import {React, ReactDOM} from "./lib/react.js";

import {userPool} from "./lib/cognito-pool.js";
import {CognitoUser} from "./lib/cognito-user.js";


class ForgotPwdForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      oldpwd: '',
      newpwd: '',
    };
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handleOldPwdChange(e) {
    this.setState({oldpwd: e.target.value});
  }

  handleNewPwdChange(e) {
    this.setState({newpwd: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    var userData = {
        Username : this.state.username.trim(),
        Pool : userPool
    };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.forgotPassword({
        onSuccess: () => {
            // successfully initiated reset password request
        },
        onFailure: (err) => {
            alert(err);
        },
        //Optional automatic callback
        inputVerificationCode: (data) => {
            console.log('Code sent to: ' + data);
            var verificationCode = prompt('Please input verification code ' ,'');
            var newPassword = prompt('Enter new password ' ,'');
            cognitoUser.confirmPassword(verificationCode, newPassword, this);
        }
    });
  }

  render() {
    return (
        <div>
            <h3>12 - Forgot password</h3>
            <small>Starting and completing a forgot password flow for an unauthenticated user.</small>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="text"
                     value={this.state.username}
                     placeholder="Username"
                     onChange={this.handleUsernameChange.bind(this)}/>
              <input type="password"
                     value={this.state.oldpwd}
                     placeholder="Old password"
                     onChange={this.handleOldPwdChange.bind(this)}/>
              <input type="password"
                     value={this.state.newpwd}
                     placeholder="New password"
                     onChange={this.handleNewPwdChange.bind(this)}/>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<ForgotPwdForm />, document.getElementById('forgotpwd'));

