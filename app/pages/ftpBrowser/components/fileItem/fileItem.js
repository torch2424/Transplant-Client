import React, { Component } from 'react';
import FileFolder from 'material-ui/svg-icons/file/folder';
import EditorInsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';

export default class FileItem extends Component {

  // Declare our props
  props: {
    client: obj,
    path: string,
    file: obj,
    isLoading: obj,
    goToDirectory: () => void,
    downloadFile: () => void
  }

  // Our constructor, where we shall be setting state
  constructor(props) {
    super(props);

    // State should be used for component based state, where store is used for global app state
    this.state = {
      isDir: false
    };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.isLoading.listFiles) {
      // Don't allow anything if we are still loading files
      return;
    }

    // If we are a directory, go to the directory
    if (this.state.isDir) {
      this.props.goToDirectory(this.props.client, this.props.path, this.props.file.filename);
    } else {
      this.props.downloadFile(this.props.client, this.props.path, this.props.file.filename);
    }
  }

  render() {
    // Decide if we are a directory
    if (this.props.file.longname.charAt(0) === 'd') {
      this.state.isDir = true;
    }

    // First get our icon
    let icon;
    if (this.state.isDir) {
      icon = (
        <FileFolder />
      );
    } else {
      icon = (
        <EditorInsertDriveFile />
      );
    }

    // Then get our file name (add a slash if a directory)
    let fileName;
    if (this.state.isDir) {
      fileName = `${this.props.file.filename}/`;
    } else {
      fileName = this.props.file.filename;
    }

    return (
      <div className="file-item">
        <div
          role="button"
          tabIndex={0}
          className="file-item__row"
          onClick={this.handleClick}>
          <div className="file-item__row__item">
            {icon}
          </div>
          <div className="file-item__row__item">
            {fileName}
          </div>
        </div>
      </div>
    );
  }
}
