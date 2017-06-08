import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";


class DisableMfaForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    fakeUser.disableMFA(function(err, result) {
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
            <h3>10 - Disable MFA</h3>
            <small>Disabling MFA for a user on a pool that has an optional MFA setting for an authenticated user.</small>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<DisableMfaForm />, document.getElementById('disablemfa'));

