import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";


class ForgetDeviceForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    fakeUser.forgetDevice({
        onSuccess: (result) => {
            console.log('call result: ' + result);
        },
        onFailure: (err) => {
            alert(err);
        }
    });
  }

  render() {
    return (
        <div>
            <h3>22 - Forget the current device</h3>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<ForgetDeviceForm />, document.getElementById('forgetdevice'));

