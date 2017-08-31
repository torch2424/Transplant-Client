import React, { Component } from 'react';
import prettyBytes from 'pretty-bytes';
import LinearProgress from 'material-ui/LinearProgress';

export default class TransferItem extends Component {

  // Declare our props
  props: {
    transferPath: string,
    transfer: obj
  }

  // Our constructor, where we shall be setting state
  constructor(props) {
    super(props);
    // Get our transfer title
    const pathSplit = this.props.transferPath.split('/');
    const name = pathSplit[pathSplit.length - 1];
    this.state = {
      name,
      progress: this.props.transfer.transferProgress,
      total: this.props.transfer.totalSize
    };
  }

  render() {
    this.state.transferProgress = this.props.transfer.transferProgress;

    // Check if we finished the transfer
    const transferCompleted =
      this.props.transfer.transferProgress ===
      this.props.transfer.totalSize;


    let transferStatus;
    if (transferCompleted) {
      transferStatus = (
        <div>
          <div className="transfer-item__completed">
            Completed.
          </div>
          <div className="transfer-item__total">
            Size: {prettyBytes(this.state.total)}
          </div>
        </div>
      );
    } else {
      transferStatus = (
        <div>
          <LinearProgress
            mode="determinate"
            min={0}
            max={this.state.total}
            value={this.state.progress} />
          <div className="transfer-item__progress">
            {prettyBytes(this.state.progress)} / {prettyBytes(this.state.total)}
          </div>
        </div>
      );
    }

    return (
      <div className="transfer-item">
        <h3>{this.state.name}</h3>
        {transferStatus}
      </div>
    );
  }
}
