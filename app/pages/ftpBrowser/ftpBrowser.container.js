import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FtpBrowser from './ftpBrowser';
import * as sftpActions from '../../services/sftp/sftp.action';

// Containers allow for binding of the state and reducer to the actual component

function mapStateToProps(state) {
  // Grab our response, use the state to grab the current shared ftp client
  const response = {
    client: state.sftp.client,
    isLoading: false
  };

  if (state.sftp && state.sftp.isLoading) {
    response.isLoading = true;
  }

  return response;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(sftpActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FtpBrowser);
