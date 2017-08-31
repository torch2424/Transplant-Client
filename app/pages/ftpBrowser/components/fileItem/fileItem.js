import React, { Component } from 'react';
import FileFolder from 'material-ui/svg-icons/file/folder';
import EditorInsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';

export default class FileItem extends Component {

  // Declare our props
  props: {
    transplant: obj,
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
    this.state = {};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.isLoading.listFiles) {
      // Don't allow anything if we are still loading files
      return;
    }

    // If we are a directory, go to the directory
    if (this.props.file.isDir) {
      this.props.goToDirectory(this.props.transplant, this.props.path, this.props.file.fileName);
    } else {
      this.props.downloadFile(this.props.transplant, this.props.path, this.props.file.fileName);
    }
  }

  render() {
    // First get our icon
    let icon;
    if (this.props.file.isDir) {
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
    if (this.props.file.isDir) {
      fileName = `${this.props.file.fileName}/`;
    } else {
      fileName = this.props.file.fileName;
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
