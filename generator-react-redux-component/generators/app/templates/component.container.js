import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import <%= capitalizedComponentName %> from './<%= componentName %>';
// import * as ourActions from '../actions/ourAction.action';

// Containers allow for binding of the state and reducer to the actual component

function mapStateToProps(state) {
  // Grab our props as response from the current state, e.g
  const response = {
    isComponent: state.component.isComponent,
  };

  return response;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(/* ourActions */, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(<%= capitalizedComponentName %>);
