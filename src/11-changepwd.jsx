import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";


class ChangePwdForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldpwd: '',
      newpwd: '',
    };
  }

  handleOldPwdChange(e) {
    this.setState({oldpwd: e.target.value});
  }

  handleNewPwdChange(e) {
    this.setState({newpwd: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    fakeUser.changePassword(this.state.oldpwd.trim(), this.state.newpwd.trim(), (err, result) => {
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
            <h3>11 - Change password</h3>
            <small>Changing the current password for an authenticated user.</small>
            <form onSubmit={this.handleSubmit.bind(this)}>
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

ReactDOM.render(<ChangePwdForm />, document.getElementById('changepwd'));

