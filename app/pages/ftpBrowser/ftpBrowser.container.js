import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FtpBrowser from './ftpBrowser';
import * as transplantActions from '../../services/transplant/transplant.action';

// Containers allow for binding of the state and reducer to the actual component

function mapStateToProps(state) {
  // Grab our response, use the state to grab the current shared ftp client
  const response = {
    transplant: state.transplant.transplant,
    protocol: state.transplant.protocol,
    path: '',
    isLoading: {}
  };

  if (state.transplant && state.transplant.isLoading) {
    response.isLoading = state.transplant.isLoading;
  }

  if (state.transplant && state.transplant.path) {
    response.path = state.transplant.path;
  }

  return response;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(transplantActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FtpBrowser);
