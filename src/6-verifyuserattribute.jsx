import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";


class VerifyUserAttributeForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    fakeUser.getAttributeVerificationCode('email', {
        onSuccess: (result) => {
            console.log('call result: ' + result);
        },
        onFailure: (err) => {
            alert(err);
        },
        inputVerificationCode: () => {
            var verificationCode = prompt('Please input verification code: ' ,'');
            cognitoUser.verifyAttribute('email', verificationCode, this);
        }
    });
  }

  render() {
    return (
        <div>
            <h3>6 - Verify user attribute</h3>
            <small>Verify user attribute for an authenticated user.</small>
            <br /><small>Note that the inputVerificationCode method needs to be defined but does not need to actually do anything. If you would like the user to input the verification code on another page, you can set inputVerificationCode to null. If inputVerificationCode is null, onSuccess will be called immediately (assuming there is no error).</small>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<VerifyUserAttributeForm />, document.getElementById('verifyuserattribute'));

