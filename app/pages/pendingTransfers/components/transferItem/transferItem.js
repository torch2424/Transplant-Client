import React, { Component } from 'react';
import prettyBytes from 'pretty-bytes';
import LinearProgress from 'material-ui/LinearProgress';

export default class TransferItem extends Component {

  // Declare our props
  props: {
    transferPath: string,
    transfer: obj
  }

  // Private Wrapper function for preetyBytes
  static _getSize(bytes) {
    if (bytes) {
      if (typeof bytes === 'number') {
        return prettyBytes(bytes);
      } else if (typeof bytes === 'string') {
        return prettyBytes(parseInt(bytes, 10));
      }
      return 'Bad size input';
    }
    return 'Loading...';
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
    const transferCompleted = this.props.transfer.transferCompleted;


    let transferStatus;
    if (transferCompleted) {
      transferStatus = (
        <div>
          <div className="transfer-item__completed">
            Completed.
          </div>
          <div className="transfer-item__total">
            Size: {TransferItem._getSize(this.state.total)}
          </div>
        </div>
      );
    } else if (!this.state.progress ||
      !this.state.total) {
      transferStatus = (
        <div>
          <LinearProgress mode="indeterminate" />
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
            {TransferItem._getSize(this.state.progress)} / {TransferItem._getSize(this.state.total)}
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
