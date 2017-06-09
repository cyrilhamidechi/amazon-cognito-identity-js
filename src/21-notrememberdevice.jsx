import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";


class NotRememberDeviceForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    fakeUser.setDeviceStatusNotRemembered({
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
            <h3>21 - Do not remember the current device</h3>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<NotRememberDeviceForm />, document.getElementById('notrememberdevice'));

