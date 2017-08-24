// All Redux things start with actions, with how we will edit the single source of truth state.
// This will be used by a reducer

// This is where business logic is performed
import * as ssh from 'ssh2';

// Import history for navigation from our store (Switches between hash and browser for us)
import { history } from '../../store/configureStore';

// Our Action Constants
export const CONNECT_START = 'CONNECT_START';
export const CONNECT_SUCCESS = 'CONNECT_SUCCESS';
export const CONNECT_ERROR = 'CONNECT_ERROR';

export const LIST_FILES_START = 'LIST_FILES_START';
export const LIST_FILES_SUCCESS = 'LIST_FILES_SUCCESS';

// Function to return our connection action type
export function connect(event, loginInfo) {
  // Stop the default event
  event.preventDefault();

  // Wrap in dispatch to allow communication with reducer
  return (dispatch) => {
    // Start the connection
    const client = new ssh.Client();
    client.on('ready', () => {
      client.sftp((err, sftpClient) => {
        if (err) throw err;

        // Dispatch the sucessful connection ot our reducer
        dispatch({
          type: CONNECT_SUCCESS,
          client: sftpClient
        });

        // Move to the ftpbrowser page
        history.push('/view');
      });
    }).connect({
      host: loginInfo.host,
      port: loginInfo.port,
      username: loginInfo.username,
      password: loginInfo.password
    });

    // Dispatch that we started the connection
    dispatch({
      type: CONNECT_START
    });
  };
}

// function to get our files from a directory
export function listFiles(sftpClient, directory) {
  if (!sftpClient) {
    // Move to the login page
    history.push('/');
    return;
  }

  // dispatch our actions
  return (dispatch) => {
    // start loading
    dispatch({
      type: LIST_FILES_START,
      isLoading: true
    });
    // Read the user home directory
    sftpClient.readdir(directory, (listErr, list) => {
      if (listErr) {
        throw listErr;
      }
      // Dispatch the sucessful connection ot our reducer
      dispatch({
        type: LIST_FILES_SUCCESS,
        files: list
      });
    });
  };
}
