import {
  CONNECT_START,
  CONNECT_SUCCESS,
  LOGOUT,
  LIST_FILES_START,
  LIST_FILES_SUCCESS,
  GET_INITIAL_DIRECTORY_START,
  GET_INITIAL_DIRECTORY_SUCCESS,
  GO_TO_DIRECTORY_START,
  GO_TO_DIRECTORY_SUCCESS,
  DOWNLOAD_FILE_START,
  DOWNLOAD_FILE_SUCCESS
} from './sftp.action';


// Reducers handle actions, and are called every time an action is broadcasted

export type sftpStateType = {
  client: object,
  isLoading: object
};

type actionType = {
  type: string
};

export default function sftp(state: object = {}, action: actionType) {
  // Get a copy for our new state
  const newState = Object.assign({}, state);
  // Ensure we have an isLoading Object
  if (!newState.isLoading) {
    newState.isLoading = {};
  }

  switch (action.type) {
    case CONNECT_START:
      newState.isLoading.connect = true;
      return newState;
    case CONNECT_SUCCESS:
      newState.isLoading.connect = false;
      newState.client = action.client;
      newState.files = [];
      return newState;
    case LOGOUT:
      return {};
    case LIST_FILES_START:
      newState.isLoading.listFiles = true;
      return newState;
    case LIST_FILES_SUCCESS:
      newState.isLoading.listFiles = false;
      newState.files = action.files;
      return newState;
    case GET_INITIAL_DIRECTORY_START:
      newState.isLoading.getInitialDirectory = true;
      return newState;
    case GET_INITIAL_DIRECTORY_SUCCESS:
      newState.isLoading.getInitialDirectory = false;
      newState.initialPath = action.path;
      newState.path = action.path;
      return newState;
    case GO_TO_DIRECTORY_START:
      newState.isLoading.goToDirectory = true;
      return newState;
    case GO_TO_DIRECTORY_SUCCESS:
      newState.isLoading.goToDirectory = false;

      // Change the current path
      if (action.directory.includes('..')) {
        // Pop off the last directory, and join back into the new path
        const splitPath = newState.path.split('/');
        console.log(splitPath);
        splitPath.splice(splitPath.length - 2);
        newState.path = `${splitPath.join('/')}/`;
        console.log(`${splitPath.join('/')}/`);
        console.log(newState.path);
      } else {
        newState.path += `${action.directory}/`;
      }

      return newState;
    case DOWNLOAD_FILE_START:
      newState.isLoading.downloadFile = true;
      return newState;
    case DOWNLOAD_FILE_SUCCESS:
      newState.isLoading.downloadFile = true;
      return newState;
    default:
      return state;
  }
}
