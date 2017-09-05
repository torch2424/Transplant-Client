import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

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
    let transferItems = [];

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
              className="pending-transfers__transfer-item"
              transfer={this.props.transfers[transferKey]}
              transferPath={transferKey} />
            <div>
              <hr />
            </div>
          </div>
          ));
      });
    } else {
      transferItems = (
        <main className="pending-transfers__no-transfers animated fadeIn">
          <h2>
              No Pending Transfers <span role="img" aria-label="Sad Face Emoji">😞</span>
          </h2>
          <div>
              Transfer some stuff to view its status
            </div>
        </main>
      );
    }

    return (
      <div className="pending-transfers">
        <IconButton
          className="pending-transfers__back animated fadeInLeft"
          tooltip="Back"
          containerElement={<Link to="/view" />}>
          <NavigationArrowBack />
        </IconButton>
        <div>
          {transferItems}
        </div>
      </div>
    );
  }
}
