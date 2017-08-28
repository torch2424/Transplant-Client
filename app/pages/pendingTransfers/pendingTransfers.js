import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Import our components
import TransferItem from './components/transferItem/transferItem.container';

export default class PendingTransfers extends Component {

  // Declare our props
  props: {
    transfers: obj
  }

  // Our constructor, where we shall be setting state
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // Create an array of transferItems to be rendered
    const transferItems = [];

    if (this.props.transfers &&
      Object.keys(this.props.transfers).length > 0) {
      // Push the initial horizontal divider
      transferItems.push((
        <div key={Math.random()}>
          <hr />
        </div>
      ));

      Object.keys(this.props.transfers).forEach(transferKey => {
        transferItems.push((
          <div key={Math.random()}>
            <TransferItem
              transfer={this.props.transfers[transferKey]}
              transferPath={transferKey} />
            <hr />
          </div>
          ));
      });
    }

    return (
      <div className="pending-transfers">
        <div className="pending-transfers__back">
          <Link to="/view">Back</Link>
        </div>
        <div>
          {transferItems}
        </div>
      </div>
    );
  }
}
