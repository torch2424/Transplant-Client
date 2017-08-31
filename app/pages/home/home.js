import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import LinearProgress from 'material-ui/LinearProgress';

// Import our Protocols
import { PROTOCOL } from '../../services/transplant';
// Import the credential storage
import * as credentialStorage from '../../services/credentialStorage';

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
      protocol: PROTOCOL.SFTP,
      username: '',
      host: '',
      port: '22',
      password: ''
    };
  }

  componentDidMount() {
    const savedConnections = [];
    const accounts = credentialStorage.getAllAccounts();
    // Loop through our account keys
    accounts.forEach((account) => {
      savedConnections.push((
        <div key={Math.random()}>
          <div
            className="connections-container__connection"
            role="button"
            tabIndex="0"
            onClick={() => this.setAccount(account.accountKey)}>
            {account.decodedAccountKey}
          </div>

          <hr />
        </div>
      ));

      // Must use setState to cause a re-render on state change
      this.setState({
        savedConnections
      });
    });
  }

  // Our text change handler
  inputChange = (event, newValue) => {
    const stateChange = {};
    stateChange[event.target.name] = newValue;
    this.setState(stateChange);
  }

  // Our select change handler
  selectChange = (event, index, newValue) => {
    const stateChange = {};
    stateChange.protocol = newValue;
    if (stateChange.protocol === PROTOCOL.FTP) {
      stateChange.port = '21';
    } else if (stateChange.protocol === PROTOCOL.SFTP) {
      stateChange.port = '22';
    }
    this.setState(stateChange);
  }

  // Set a selected saved accounts
  setAccount = (accountKey) => {
    credentialStorage.getAccountWithPass(accountKey).then((account) => {
      this.setState({
        protocol: account.protocol,
        username: account.username,
        host: account.host,
        port: account.port,
        password: account.password
      });
    }).catch((err) => {
      console.log(err);
    });
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

    // Get our saved connections
    let savedConnectionsContainer;
    if (this.state.savedConnections &&
      this.state.savedConnections.length > 0) {
      savedConnectionsContainer = (
        <div className="connections-container">
          <h2 className="connections-container__title">
            Saved Connections:
          </h2>

          <hr />

          {this.state.savedConnections}
        </div>
      );
    } else {
      savedConnectionsContainer = (
        <div />
      );
    }

    return (
      <div className="flex-container">
        <form
          className="login-form"
          onSubmit={(event) => {
            this.props.connect(event, {
              protocol: this.state.protocol,
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
            The drag and drop file transfer client
          </div>

          <div className="select-container">
            <SelectField
              floatingLabelText="Protocol"
              name="protocol"
              value={this.state.protocol}
              onChange={this.selectChange}
              >
              <MenuItem
                value={PROTOCOL.FTP}
                primaryText="ftp://" />
              <MenuItem
                value={PROTOCOL.SFTP}
                primaryText="sftp://" />
            </SelectField>
          </div>

          <TextField /* Username input*/
            className="textfield"
            name="username"
            hintText="transplant"
            value={this.state.username}
            onChange={this.inputChange}
            disabled={this.props.isLoading.connect} />
          <span>
            @
          </span>
          <TextField /* Host input*/
            className="textfield textfield--host"
            name="host"
            value={this.state.host}
            onChange={this.inputChange}
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
                  this.inputChange(event, newValue);
                }
              }} />
          </div>

          <div>
            <TextField /* Password input*/
              name="password"
              hintText="Password"
              onChange={this.inputChange}
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

        { savedConnectionsContainer }
      </div>
    );
  }
}
