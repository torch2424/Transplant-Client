import {
  CONNECT_START,
  CONNECT_SUCCESS,
  LOGOUT,
  LIST_FILES_START,
  LIST_FILES_SUCCESS,
  GO_TO_DIRECTORY_START,
  GO_TO_DIRECTORY_SUCCESS,
  DOWNLOAD_FILE_START,
  DOWNLOAD_FILE_PROGRESS,
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
  // Ensure we have an immutable isLoading Object
  if (!newState.isLoading) {
    newState.isLoading = {};
  } else {
    newState.isLoading = Object.assign({}, newState.isLoading);
  }

  switch (action.type) {
    case CONNECT_START:
      newState.isLoading.connect = true;
      return newState;
    case CONNECT_SUCCESS:
      newState.isLoading.connect = false;
      newState.transplant = action.transplant;
      newState.files = action.files;
      newState.initialPath = action.path;
      newState.path = action.path;
      return newState;
    case LOGOUT:
      return {};
    case LIST_FILES_START:
      newState.isLoading.listFiles = true;
      newState.files = [];
      return newState;
    case LIST_FILES_SUCCESS:
      newState.isLoading.listFiles = false;
      newState.files = action.files;
      return newState;
    case GO_TO_DIRECTORY_START:
      newState.isLoading.listFiles = true;
      newState.isLoading.goToDirectory = true;
      return newState;
    case GO_TO_DIRECTORY_SUCCESS:
      newState.isLoading.listFiles = false;
      newState.isLoading.goToDirectory = false;
      newState.path = action.directory;
      newState.files = action.files;
      return newState;
    case DOWNLOAD_FILE_START:
      newState.isLoading.downloadFile = true;
      if (!newState.transfers) {
        newState.transfers = {};
      }
      newState.transfers[action.remotePath] = {};
      return newState;
    case DOWNLOAD_FILE_PROGRESS:
      if (!newState.transfers) {
        newState.transfers = {};
      }
      // For nested objects, every level of the object must be re-created to be re-rendered.
      // Thus, libraries like immutable.js are useful, as objects are automatically
      // Recreated, instead of updated.
      // http://redux.js.org/docs/Troubleshooting.html
      // http://redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html
      newState.transfers = Object.assign({}, newState.transfers);
      newState.transfers[action.remotePath] =
      Object.assign({}, newState.transfers[action.remotePath], {
        transferProgress: action.transferProgress,
        totalSize: action.totalSize
      });
      return newState;
    case DOWNLOAD_FILE_SUCCESS:
      newState.isLoading.downloadFile = false;
      return newState;
    default:
      return state;
  }
}
