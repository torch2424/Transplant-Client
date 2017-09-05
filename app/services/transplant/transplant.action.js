// All Redux things start with actions, with how we will edit the single source of truth state.
// This will be used by a reducer

// Import the transplat wrapper
import { Transplant, TRANSFER_TYPE } from '../transplant';

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

export const UPLOAD_FILE_START = 'UPLOAD_FILE_START';
export const UPLOAD_FILE_PROGRESS = 'UPLOAD_FILE_PROGRESS';
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';

export const MAKE_DIRECTORY_START = 'MAKE_DIRECTORY_START';
export const MAKE_DIRECTORY_SUCCESS = 'MAKE_DIRECTORY_SUCCESS';

// Get some electron goodies
const app = require('electron').remote.app;

// Private Function to add trailing slashes to our paths
function _addTrailingSlashIfNotPresent(path) {
  // Check the last character of the path for a slash
  if (path.substr(-1) !== '/') {
    const trailingSlashPath = `${path}/`;
    return trailingSlashPath;
  }

  return path;
}

// Function to return our connection action type
export function connect(event, loginInfo) {
  // Wrap in dispatch to allow communication with reducer
  return (dispatch) => {
    // Dispatch that we started the connection
    dispatch({
      type: CONNECT_START
    });

    const transplant = new Transplant(loginInfo.protocol);
    transplant.connect(loginInfo.host,
      loginInfo.username, loginInfo.password, loginInfo.port).then((connectRes) => {
        // Save our credentials because of the succssful connection
        credentialStorage.setCredentials(loginInfo.protocol, loginInfo.host,
          loginInfo.username, loginInfo.password, loginInfo.port)
          .then(() => {
            // Dispatch the sucessful connection ot our reducer
            dispatch({
              transplant,
              type: CONNECT_SUCCESS,
              path: _addTrailingSlashIfNotPresent(connectRes.path),
              files: connectRes.list
            });

            // Move to the ftpbrowser page
            history.push('/view');
          }).catch((credErr) => {
            console.log(credErr);
          });
      }).catch((err) => {
        console.log(err);
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

// function to get our files from a directory
export function listFiles(transplant, directory) {
  if (!transplant) {
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
    transplant.listFiles(directory).then((files) => {
      // Dispatch the sucessful connection ot our reducer
      dispatch({
        type: LIST_FILES_SUCCESS,
        files
      });
    }).catch((err) => {
      console.log(err);
    });
  };
}

// function to navigate to another directory
export function goToDirectory(transplant, currentDirectory, directory) {
  if (!transplant) {
    // Move to the login page
    history.push('/');
    return;
  }

  // Define our new directory
  let newDirectory = '';
  if (directory.includes('..')) {
    // Pop off the last directory, and join back into the new path
    const splitPath = currentDirectory.split('/');
    // Check for an extra element cause by a trailing slash
    if (splitPath[splitPath.length - 1] === '') {
      splitPath.splice(splitPath.length - 2);
    } else {
      splitPath.pop();
    }
    newDirectory = `${splitPath.join('/')}/`;
  } else if (currentDirectory.substr(-1) !== '/') {
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
    transplant.changeDirectory(newDirectory).then((directoryAndList) => {
      // Dispatch the sucessful connection to our reducer
      dispatch({
        type: GO_TO_DIRECTORY_SUCCESS,
        directory: directoryAndList.directory,
        files: directoryAndList.list
      });
    }).catch((cdErr) => {
      console.log(cdErr);
    });
  };
}

// Function to download a file
export function downloadFile(transplant, directory, fileName) {
  if (!transplant) {
    // Move to the login page
    history.push('/');
  }

  const filePath = directory + fileName;
  // Using electron app to get downloads folder:
  // https://discuss.atom.io/t/get-special-folder-path-in-electron/30198/3
  const downloadPath = `${app.getPath('downloads')}/${fileName}`;

  return (dispatch) => {
    // start loading
    dispatch({
      type: DOWNLOAD_FILE_START,
      transferType: TRANSFER_TYPE.GET,
      isLoading: true,
      remotePath: filePath,
    });

    const progressCallback = (localFilePath, action, total, transferred) => {
      dispatch({
        type: DOWNLOAD_FILE_PROGRESS,
        transferType: TRANSFER_TYPE.GET,
        remotePath: filePath,
        transferProgress: transferred,
        totalSize: total
      });
    };

    // Download the file
    transplant.downloadFile(filePath, downloadPath, progressCallback).then(() => {
      // Dispatch the sucessful connection ot our reducer
      dispatch({
        type: DOWNLOAD_FILE_SUCCESS,
        transferType: TRANSFER_TYPE.GET,
        remotePath: filePath,
      });
    }).catch((err) => {
      console.log(err);
    });
  };
}

// Function to upload a file
export function uploadFile(transplant, localFilePath, remoteDirectory) {
  if (!transplant) {
    // Move to the login page
    history.push('/');
  }

  // Get the proposed remote file path from the local file and remote directory
  const pathSplit = localFilePath.split('/');
  const remoteFilePath =
    `${_addTrailingSlashIfNotPresent(remoteDirectory)}${pathSplit[pathSplit.length - 1]}`;

  return (dispatch) => {
    // start loading
    dispatch({
      type: UPLOAD_FILE_START,
      transferType: TRANSFER_TYPE.PUT,
      isLoading: true,
      remotePath: remoteFilePath,
    });

    const progressCallback = (filePath, action, total, transferred) => {
      dispatch({
        type: UPLOAD_FILE_PROGRESS,
        transferType: TRANSFER_TYPE.PUT,
        remotePath: filePath,
        transferProgress: transferred,
        totalSize: total
      });
    };

    // Download the file
    transplant.uploadFile(remoteFilePath, localFilePath, progressCallback).then(() => {
      // Dispatch the sucessful connection ot our reducer
      dispatch({
        type: UPLOAD_FILE_SUCCESS,
        transferType: TRANSFER_TYPE.PUT,
        remotePath: remoteFilePath,
      });

      // Finally, list files of our updated path
      // Call the function, which returns a function, that has dispatch as a param
      listFiles(transplant, remoteDirectory)(dispatch);
    }).catch((err) => {
      console.log(err);
    });
  };
}

export function makeDirectory(transplant, currentRemotePath, directoryName) {
  if (!transplant) {
    // Move to the login page
    history.push('/');
  }

  const directoryPath =
    `${_addTrailingSlashIfNotPresent(currentRemotePath)}${directoryName}`;

  return (dispatch) => {
    // start loading
    dispatch({
      type: MAKE_DIRECTORY_START,
      path: directoryPath,
    });

    transplant.makeDirectory(directoryPath).then(() => {
      dispatch({
        type: MAKE_DIRECTORY_SUCCESS,
        path: directoryPath,
      });

      // Finally, list files of our updated path
      // Call the function, which returns a function, that has dispatch as a param
      listFiles(transplant, currentRemotePath)(dispatch);
    }).catch((err) => {
      console.log(err);
    });
  };
}
