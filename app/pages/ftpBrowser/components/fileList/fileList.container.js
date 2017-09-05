import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FileList from './fileList';
import * as transplantActions from '../../../../services/transplant/transplant.action';

// Containers allow for binding of the state and reducer to the actual component

function mapStateToProps(state) {
  // Grab our response, use the state to grab the current shared ftp client
  const response = {
    protocol: state.transplant.protocol,
    path: '/',
    initialPath: '/',
    files: [],
    isLoading: {}
  };

  if (state.transplant && state.transplant.isLoading) {
    response.isLoading = state.transplant.isLoading;
  }

  if (state.transplant && state.transplant.path) {
    response.path = state.transplant.path;
  }

  if (state.transplant && state.transplant.initialPath) {
    response.initialPath = state.transplant.initialPath;
  }

  if (state.transplant && state.transplant.files &&
    state.transplant.files.length > 0) {
    response.files = state.transplant.files;
  }

  return response;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(transplantActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList);
