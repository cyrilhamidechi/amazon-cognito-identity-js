import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";
import {CognitoUserAttribute} from "./lib/cognito-user.js";


class UpdateUserAttributeForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    var attributeList = [];
    var attribute = {
        Name : 'nickname',
        Value : 'joe'
    };
    var attribute = new CognitoUserAttribute(attribute);
    attributeList.push(attribute);

    fakeUser.updateAttributes(attributeList, (err, result) => {
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
            <h3>8 - Update user attribute</h3>
            <small>Update user attribute for an authenticated user.</small>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<UpdateUserAttributeForm />, document.getElementById('updateuserattribute'));

