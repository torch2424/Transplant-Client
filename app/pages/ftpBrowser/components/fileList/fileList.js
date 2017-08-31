import React, { Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';

// Import our file items
import FileItem from '../fileItem/fileItem.container';

export default class FileList extends Component {

  // Declare our props
  // No comment is too dumb, imo
  // obj --> JSON Object
  props: {
    protocol: obj,
    isLoading: obj,
    listFiles: () => void,
    files: Array<obj>,
    path: string,
    initialPath: string
  }

  // Our constructor, where we shall be setting state
  constructor(props) {
    super(props);

    if (!this.props.files || this.props.files.length < 1) {
      this.props.listFiles(this.props.protocol, '.');
    }
  }

  render() {
    // Get the files if we dont have them
    let fileList = [];

    // Push the initial horizontal divider
    fileList.push((
      <hr key={Math.random()} />
    ));

    // Check if we can go to the parent directory
    if (!this.props.isLoading.listFiles &&
      this.props.initialPath &&
      this.props.path &&
      this.props.path.length >
      this.props.initialPath.length
    ) {
      const parentDir = {
        fileName: '..',
        isDir: true
      };
      fileList.push((
        <div key={Math.random()}>
          <FileItem
            file={parentDir}
          />
          <hr />
        </div>
      ));
    }

    // Push the files we have in our files array
    if (!this.props.isLoading.listFiles &&
      this.props.files &&
      this.props.files.length > 0) {
      this.props.files.forEach((file) => {
        fileList.push((
          <div key={Math.random()}>
            <FileItem
              file={file}
            />
            <hr />
          </div>
        ));
      });
    }

    // Check if we have an empty fileList
    // (Just the initial <hr /> we pushed earlier)
    // If so, just set a div to be rendered
    if (fileList.length < 2) {
      fileList = (
        <div key={Math.random()} />
      );
    }

    let loadingBar;
    if (this.props.isLoading.listFiles) {
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
