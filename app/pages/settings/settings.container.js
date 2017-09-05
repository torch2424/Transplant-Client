import { connect } from 'react-redux';
import Settings from './settings';

// Containers allow for binding of the state and reducer to the actual component

function mapStateToProps(/* state */) {
  // Grab our props as response from the current state, e.g
  const response = {};

  return response;
}

export default connect(mapStateToProps)(Settings);
