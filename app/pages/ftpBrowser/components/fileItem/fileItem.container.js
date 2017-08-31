import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FileItem from './fileItem';
import * as sftpActions from '../../../../services/sftp/sftp.action';

// Containers allow for binding of the state and reducer to the actual component

function mapStateToProps(state) {
  // Grab our response, use the state to grab the current shared ftp client
  const response = {
    transplant: state.sftp.transplant,
    path: '/',
    isLoading: {}
  };

  if (state.sftp && state.sftp.path) {
    response.path = state.sftp.path;
  }

  if (state.sftp && state.sftp.isLoading) {
    response.isLoading = state.sftp.isLoading;
  }

  return response;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(sftpActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FileItem);
