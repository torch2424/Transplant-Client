import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

export default class Home extends Component {

  // Our props, they are immutable, and passed by parent
  props: {
    connect: () => void,
    isLoading: obj
  }

  // Our constructor, where we shall be setting state
  constructor(props) {
    super(props);

    // State should be used for component based state, where store is used for global app state
    this.state = {
      username: '',
      host: '',
      port: '22',
      password: '',
    };
  }

  // Our text change handler
  textChange = (event, newValue) => {
    const stateChange = {};
    stateChange[event.target.name] = newValue;
    this.setState(stateChange);
  }

  render() {
    let loadingBar;

    if (this.props.isLoading.connect) {
      loadingBar = (
        <LinearProgress mode="indeterminate" />
      );
    } else {
      loadingBar = (
        <div />
      );
    }

    return (
      <div className="flex-container">
        <form
          className="login-form"
          onSubmit={(event) => {
            this.props.connect(event, {
              username: this.state.username,
              host: this.state.host,
              port: this.state.port,
              password: this.state.password
            });
          }} >

          <div /* Loading Bar for when we are connecting */>
            { loadingBar }
          </div>

          <h2 /* App Title */>
            Transplant
          </h2>
          <div /* Tagline */
            className="tagline"
          >
            The drag and drop FTP/SFTP client
          </div>
          <TextField /* Username input*/
            className="textfield"
            name="username"
            hintText="transplant"
            value={this.state.username}
            onChange={this.textChange}
            disabled={this.props.isLoading.connect} />
          <span>
            @
          </span>
          <TextField /* Host input*/
            className="textfield textfield--host"
            name="host"
            value={this.state.host}
            onChange={this.textChange}
            hintText="localhost"
            disabled={this.props.isLoading.connect} />

          <div>
            Port:
            <TextField /* Port input*/
              className="textfield textfield--port"
              name="port"
              hintText="22"
              value={this.state.port}
              disabled={this.props.isLoading.connect}
              onChange={(event, newValue) => {
                // Ensure it is numbers only
                // Material-ui text input doesn't have a number mode
                if (/^\d+$/.test(newValue)) {
                  // Call the text change function
                  this.textChange(event, newValue);
                }
              }} />
          </div>

          <div>
            <TextField /* Password input*/
              name="password"
              hintText="Password"
              onChange={this.textChange}
              value={this.state.password}
              disabled={this.props.isLoading.connect}
              type="password" />
          </div>

          <div>
            <RaisedButton /* submit/connect button */
              label="Connect"
              primary
              disabled={this.props.isLoading.connect}
              type="submit" />
          </div>
        </form>
      </div>
    );
  }
}
