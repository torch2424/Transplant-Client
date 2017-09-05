import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from './home';
import * as transplantActions from '../../services/transplant/transplant.action';

// Containers allow for binding of the state and reducer to the actual component

function mapStateToProps(state) {
  const response = {
    connect: transplantActions.connect,
    isLoading: {}
  };

  if (state.transplant && state.transplant.isLoading) {
    response.isLoading = state.transplant.isLoading;
  }

  return response;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(transplantActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
