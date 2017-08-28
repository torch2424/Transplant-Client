import { connect } from 'react-redux';
import PendingTransfers from './pendingTransfers';

// Containers allow for binding of the state and reducer to the actual component

function mapStateToProps(state) {
  // Grab our props as response from the current state, e.g
  const response = {
    transfers: {},
  };

  if (state.sftp.transfers) {
    response.transfers = state.sftp.transfers;
  }

  return response;
}

export default connect(mapStateToProps)(PendingTransfers);
