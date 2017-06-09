import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";


class GlobalSignOutForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    fakeUser.globalSignOut({
        onSuccess: (result) => {
            console.log('call result: ' + result);
        },
        onFailure: (err) => {
            alert(err);
        },
    });
  }

  render() {
    return (
        <div>
            <h3>15 - Global sign out</h3>
            <small>Global signout for an authenticated user(invalidates all issued tokens).</small>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<GlobalSignOutForm />, document.getElementById('globalsignout'));

