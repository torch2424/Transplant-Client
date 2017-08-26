import React, { Component } from 'react';

export default class FilePath extends Component {

  // Declare our props
  props: {
    path: string
  }

  render() {
    return (
      <div className="file-path">
        <span className="file-path__label">Current Path: </span>
        {this.props.path}
      </div>
    );
  }
}
