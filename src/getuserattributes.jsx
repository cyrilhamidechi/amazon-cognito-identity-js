// Use case 5.
// Retrieve user attributes for an authenticated user.

import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";


class GetUserAttributesForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    fakeUser.getUserAttributes(function(err, result){
        if (err) {
            alert(err);
            return;
        }
        for (i = 0; i < result.length; i++) {
            console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
        }
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="submit"/>
      </form>
    );
  }
}

ReactDOM.render(<GetUserAttributesForm />, document.getElementById('getuserattributes'));

