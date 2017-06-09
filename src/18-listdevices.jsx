import {React, ReactDOM} from "./lib/react.js";

import {fakeUser} from "./lib/cognito-fakeuser.js";


class ListDevicesForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: '',
      paginationToken: ''
    };
  }

  handleLimitChange(e) {
    this.setState({limit: e.target.value});
  }

  handlePaginationTokenChange(e) {
    this.setState({paginationToken: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    fakeUser.listDevices(this.state.limit.trim(), this.state.paginationToken.trim(), {
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
            <h3>18 - List devices</h3>
            <small>
                List all remembered devices for an authenticated user.
                <br />In this case, we need to pass a limit on the number of devices retrieved at a time and a pagination token is returned to make subsequent calls.
                <br />The pagination token can be subsequently passed.
                <br />When making the first call, the pagination token should be null.
            </small>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="text"
                     value={this.state.limit}
                     placeholder="Limit"
                     onChange={this.handleLimitChange.bind(this)}/>
              <input type="text"
                     value={this.state.paginationToken}
                     placeholder="Pagination token"
                     onChange={this.handlePaginationTokenChange.bind(this)}/>
              <input type="submit"/>
            </form>
            <hr />
        </div>
    );
  }
}

ReactDOM.render(<ListDevicesForm />, document.getElementById('listdevices'));

