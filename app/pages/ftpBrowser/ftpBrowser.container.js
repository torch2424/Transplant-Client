import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FtpBrowser from './ftpBrowser';
import * as sftpActions from '../../services/sftp/sftp.action';

// Containers allow for binding of the state and reducer to the actual component

function mapStateToProps(state) {
  // Grab our response, use the state to grab the current shared ftp client
  const response = {
    client: state.sftp.client,
    path: '',
    isLoading: {}
  };

  if (state.sftp && state.sftp.isLoading) {
    response.isLoading = state.sftp.isLoading;
  }

  if (state.sftp && state.sftp.path) {
    response.path = state.sftp.path;
  }

  return response;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(sftpActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FtpBrowser);
