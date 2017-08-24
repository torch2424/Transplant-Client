import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FileList from './fileList';
import * as sftpActions from '../../../../services/sftp/sftp.action';

// Containers allow for binding of the state and reducer to the actual component

function mapStateToProps(state) {
  // Grab our response, use the state to grab the current shared ftp client
  const response = {
    client: state.sftp.client,
    files: [],
    isLoading: false
  };

  if (state.sftp && state.sftp.isLoading) {
    response.isLoading = true;
  }
  if (state.sftp && state.sftp.files &&
    state.sftp.files.length > 0) {
    response.files = state.sftp.files;
  }

  return response;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(sftpActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList);
