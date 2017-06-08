import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";


class EnableMfaForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    fakeUser.enableMFA(function(err, result) {
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
            <h3>9 - Enable MFA</h3>
            <small>Enabling MFA for a user on a pool that has an optional MFA setting for an authenticated user.</small>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<EnableMfaForm />, document.getElementById('enablemfa'));

