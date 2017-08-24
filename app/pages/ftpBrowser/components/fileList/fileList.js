import React, { Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';

export default class FileList extends Component {

  // Declare our props
  // No comment is too dumb, imo
  // obj --> JSON Object
  props: {
    client: obj,
    isLoading: boolean,
    listFiles: () => void,
    files: Array<obj>
  }

  // Our constructor, where we shall be setting state
  constructor(props) {
    super(props);

    if (!this.props.files || this.props.files.length < 1) {
      this.props.listFiles(this.props.client, '/');
    }
  }

  render() {
    console.log('rendered!');
    // Get the files if we dont have them
    let fileList = [];
    if (this.props.files && this.props.files.length > 0) {
      this.props.files.forEach((file) => {
        console.log(file);
        fileList.push((
          <div key={Math.random()}>
            {file.filename}
          </div>
        ));
      });
    } else {
      fileList = (
        <div />
      );
    }

    let loadingBar;
    if (this.props.isLoading) {
      loadingBar = (
        <LinearProgress mode="indeterminate" />
      );
    } else {
      loadingBar = (
        <div />
      );
    }

    return (
      <div>
        <h1>Hello! I am the File list component</h1>

        <div /* Loading Bar for when we are connecting */>
          { loadingBar }
        </div>

        <div /* Our List of files */>
          { fileList }
        </div>
      </div>
    );
  }
}
