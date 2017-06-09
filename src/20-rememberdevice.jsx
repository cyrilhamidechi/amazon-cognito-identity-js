import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";


class RememberDeviceForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    fakeUser.setDeviceStatusRemembered({
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
            <h3>20 - Remember the current device</h3>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<RememberDeviceForm />, document.getElementById('rememberdevice'));

