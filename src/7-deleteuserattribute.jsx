import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";


class DeleteUserAttributeForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    var attributeList = [];
    attributeList.push('nickname');

    fakeUser.deleteAttributes(attributeList, function(err, result) {
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
            <h3>7 - Delete user attribute</h3>
            <small>Delete user attribute for an authenticated user.</small>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<DeleteUserAttributeForm />, document.getElementById('deleteuserattribute'));

