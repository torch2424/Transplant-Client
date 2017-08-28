import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TransferItem from './transferItem';
import * as sftpActions from '../../../../services/sftp/sftp.action';

// Containers allow for binding of the state and reducer to the actual component

function mapStateToProps(state) {
  // Grab our props as response from the current state, e.g
  const response = {
    isLoading: {},
  };

  if (state.sftp && state.sftp.isLoading) {
    response.isLoading = state.sftp.isLoading;
  }

  return response;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(sftpActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TransferItem);
