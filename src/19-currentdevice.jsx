import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";


class CurrentDeviceForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    fakeUser.getDevice({
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
            <h3>19 - Current device</h3>
            <small>List information about the current device.</small>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<CurrentDeviceForm />, document.getElementById('currentdevice'));

