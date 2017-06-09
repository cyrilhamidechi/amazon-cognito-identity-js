import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";


class GetMfaOptionsForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    fakeUser.getMFAOptions((err, mfaOptions) => {
        if (err) {
            alert(err);
            return;
        }
        console.log('MFA options for user ' + mfaOptions);
    });
  }

  render() {
    return (
        <div>
            <h3>24 - Get MFA options</h3>
            <small>Retrieve the MFA Options for the user in case MFA is optional.</small>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<GetMfaOptionsForm />, document.getElementById('getmfaoptions'));

