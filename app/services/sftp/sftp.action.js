// All Redux things start with actions, with how we will edit the single source of truth state.
// This will be used by a reducer

// This is where business logic is performed
import * as ssh from 'ssh2';

// Import the transplat wrapper
import { Transplant, TYPE } from '../transplant';

// Import the credential storage
import * as credentialStorage from '../credentialStorage';

// Import history for navigation from our store (Switches between hash and browser for us)
import { history } from '../../store/configureStore';

// Our Action Constants
export const CONNECT_START = 'CONNECT_START';
export const CONNECT_SUCCESS = 'CONNECT_SUCCESS';
export const CONNECT_ERROR = 'CONNECT_ERROR';

export const LOGOUT = 'LOGOUT';

export const LIST_FILES_START = 'LIST_FILES_START';
export const LIST_FILES_SUCCESS = 'LIST_FILES_SUCCESS';

export const GET_INITIAL_DIRECTORY_START = 'GET_INITIAL_DIRECTORY_START';
export const GET_INITIAL_DIRECTORY_SUCCESS = 'GET_INITIAL_DIRECTORY_SUCCESS';

export const GO_TO_DIRECTORY_START = 'GO_TO_DIRECTORY_START';
export const GO_TO_DIRECTORY_SUCCESS = 'GO_TO_DIRECTORY_SUCCESS';

export const DOWNLOAD_FILE_START = 'DOWNLOAD_FILE_START';
export const DOWNLOAD_FILE_PROGRESS = 'DOWNLOAD_FILE_PROGRESS';
export const DOWNLOAD_FILE_SUCCESS = 'DOWNLOAD_FILE_SUCCESS';

// Get some electron goodies
const app = require('electron').remote.app;


// Function to return our connection action type
export function connect(event, loginInfo) {
  // Stop the default event
  event.preventDefault();

  const transplant = new Transplant(TYPE.SFTP);
  transplant.connect(loginInfo.host,
    loginInfo.username, loginInfo.password, loginInfo.port).then(() => {
      console.log('hi!', transplant);
      return true;
    }).catch(() => {
      console.log('error!', transplant);
    });

  // Wrap in dispatch to allow communication with reducer
  return (dispatch) => {
    // Start the connection
    const client = new ssh.Client();
    client.on('ready', () => {
      client.sftp((err, sftpClient) => {
        if (err) throw err;

        // Save our credentials because of the succssful connection
        credentialStorage.setCredentials(TYPE.SFTP, loginInfo.host,
          loginInfo.username, loginInfo.password, loginInfo.port)
          .then(() => {
            // Dispatch the sucessful connection ot our reducer
            dispatch({
              type: CONNECT_SUCCESS,
              client: sftpClient
            });

            // Move to the ftpbrowser page
            history.push('/view');
          }).catch((credErr) => {
            console.log(credErr);
          });
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

// function to clear our state, and log out
export function logout() {
  return (dispatch) => {
    // Dispatch that we logged out
    dispatch({
      type: LOGOUT
    });
  };
}

// function to get our current directory
// this should only be used after connect to get the current path
export function getInitialDirectory(sftpClient) {
  if (!sftpClient) {
    // Move to the login page
    history.push('/');
    return;
  }

  // dispatch our actions
  return (dispatch) => {
    // start loading
    dispatch({
      type: GET_INITIAL_DIRECTORY_START,
      isLoading: true
    });
    // Read the current directory absPath
    sftpClient.realpath('.', (err, absPath) => {
      if (err) {
        throw err;
      }
      // Dispatch the sucessful connection ot our reducer
      dispatch({
        type: GET_INITIAL_DIRECTORY_SUCCESS,
        path: absPath
      });
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

// function to navigate to another directory
export function goToDirectory(sftpClient, currentDirectory, directory) {
  if (!sftpClient) {
    // Move to the login page
    history.push('/');
    return;
  }

  // Define our new directory
  let newDirectory = '';
  if (currentDirectory.substr(-1) !== '/') {
    newDirectory = `${currentDirectory}/${directory}`;
  } else {
    newDirectory = currentDirectory + directory;
  }

  // dispatch our actions
  return (dispatch) => {
    // start loading
    dispatch({
      type: GO_TO_DIRECTORY_START,
      isLoading: true
    });
    // Read the user home directory
    sftpClient.opendir(newDirectory, (err) => {
      if (err) {
        throw err;
      }

      // Dispatch the sucessful connection to our reducer
      dispatch({
        type: GO_TO_DIRECTORY_SUCCESS,
        directory
      });

      // List our files
      // Call the function, which returns a function, that has dispatch as a param
      listFiles(sftpClient, newDirectory)(dispatch);
    });
  };
}

// Function to download a file
export function downloadFile(sftpClient, directory, fileName) {
  if (!sftpClient) {
    // Move to the login page
    history.push('/');
  }

  const filePath = directory + fileName;
  const downloadPath = `${app.getPath('downloads')}/${fileName}`;

  return (dispatch) => {
    // start loading
    dispatch({
      type: DOWNLOAD_FILE_START,
      isLoading: true,
      remotePath: filePath,
    });

    // Download the file
    // Using electron app to get downloads folder:
    // https://discuss.atom.io/t/get-special-folder-path-in-electron/30198/3
    sftpClient.fastGet(filePath, downloadPath, {
      step: (transferProgress, fileChunk, totalSize) => {
        // Returns size in bytes.
        // So, / 1000000 for MB
        // / 1000000000 for GB
        // Or use preety bytes: https://www.npmjs.com/package/pretty-bytes
        dispatch({
          type: DOWNLOAD_FILE_PROGRESS,
          remotePath: filePath,
          transferProgress,
          totalSize
        });
      }
    }, (err) => {
      if (err) {
        throw err;
      }

      // Dispatch the sucessful connection ot our reducer
      dispatch({
        type: DOWNLOAD_FILE_SUCCESS,
        remotePath: filePath
      });
    });
  };
}
