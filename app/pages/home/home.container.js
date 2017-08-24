import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from './home';
import * as sftpActions from '../../services/sftp/sftp.action';

// Containers allow for binding of the state and reducer to the actual component

function mapStateToProps(state) {
  const response = {
    connect: sftpActions.connect,
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
