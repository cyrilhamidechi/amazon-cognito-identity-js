import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";


class SignOutForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    fakeUser.signOut();
    console.log('logout me');

  }

  render() {
    return (
        <div>
            <h3>14 - Sign out</h3>
            <small>Signing out from the application.</small>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<SignOutForm />, document.getElementById('signout'));

