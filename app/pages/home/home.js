import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import LinearProgress from 'material-ui/LinearProgress';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';

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
      password: '',
      openConnections: false
    };
  }

  componentDidMount() {
    const savedConnections = [];
    const accounts = credentialStorage.getAllAccounts();
    // Loop through our account keys
    accounts.forEach((account) => {
      savedConnections.push((
        <MenuItem
          key={Math.random()}
          primaryText={account.decodedAccountKey}
          value={account.accountKey}
          onClick={() => this.setAccount(account.accountKey)} />
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
        <div className="home__login__connections-container">
          <IconMenu
            iconButtonElement={<IconButton><AccountCircle /></IconButton>}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            maxHeight={300}>
            {this.state.savedConnections}
          </IconMenu>

          <div className="home__login__connections-container__current-connection">
            Saved Connections
          </div>
        </div>
      );
    } else {
      savedConnectionsContainer = (
        <div />
      );
    }

    return (
      <div className="home">
        <div className="home__heading">
          <h2 /* App Title */>
            Transplant
          </h2>

          <div /* Tagline */
            className="home__heading__tagline">
            The drag and drop file transfer client
          </div>

          <div>
            { savedConnectionsContainer }
          </div>

          <div className="home__heading__loading-bar"/* Loading Bar for when we are connecting */>
            { loadingBar }
          </div>
        </div>

        <div className="home__login">
          <form
            className="home__login__form"
            onSubmit={(event) => {
            // Stop the default event
              event.preventDefault();
              this.props.connect(event, {
                protocol: this.state.protocol,
                username: this.state.username,
                host: this.state.host,
                port: this.state.port,
                password: this.state.password
              });
            }} >

            <div className="home__login__form__select-container">
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

            <div>
              <TextField /* Username input*/
                className="home__login__form__textfield"
                name="username"
                floatingLabelText="Username"
                autoFocus
                hintText="transplant"
                value={this.state.username}
                onChange={this.inputChange}
                disabled={this.props.isLoading.connect} />
            </div>

            <div>
              <TextField /* Host input*/
                className="home__login__form__textfield--host"
                name="host"
                value={this.state.host}
                onChange={this.inputChange}
                floatingLabelText="Host"
                hintText="127.0.0.1"
                disabled={this.props.isLoading.connect} />
            </div>

            <div>
              <TextField /* Port input*/
                className="home__login__form__textfield--port"
                name="port"
                floatingLabelText="Port"
                hintText="22"
                value={this.state.port}
                disabled={this.props.isLoading.connect}
                onChange={(event, newValue) => {
                // Ensure it is numbers only
                // Material-ui text input doesn't have a number mode
                  if (!newValue || /^\d+$/.test(newValue)) {
                  // Call the text change function
                    this.inputChange(event, newValue);
                  }
                }} />
            </div>

            <div>
              <TextField /* Password input*/
                className="home__login__form__textfield"
                name="password"
                floatingLabelText="Password"
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
        </div>
      </div>
    );
  }
}
