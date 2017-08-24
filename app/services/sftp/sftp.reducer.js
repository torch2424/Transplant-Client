import { CONNECT_START, CONNECT_SUCCESS, LIST_FILES_START, LIST_FILES_SUCCESS } from './sftp.action';


// Reducers handle actions, and are called every time an action is broadcasted

export type sftpStateType = {
  client: object,
  isLoading: boolean
};

type actionType = {
  type: string
};

export default function sftp(state: object = {}, action: actionType) {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case CONNECT_START:
      newState.isLoading = true;
      return newState;
    case CONNECT_SUCCESS:
      newState.isLoading = false;
      newState.client = action.client;
      newState.files = [];
      return newState;
    case LIST_FILES_START:
      newState.isLoading = true;
      return newState;
    case LIST_FILES_SUCCESS:
      newState.isLoading = false;
      newState.files = action.files;
      return newState;
    default:
      return state;
  }
}
