import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LinearProgress from 'material-ui/LinearProgress';
import TextField from 'material-ui/TextField';

import IconButton from 'material-ui/IconButton';
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel';
import FileFolder from 'material-ui/svg-icons/file/folder';
import FileCloudQueue from 'material-ui/svg-icons/file/cloud-queue';
import FileFileUpload from 'material-ui/svg-icons/file/file-upload';
import FileCreateNewFolder from 'material-ui/svg-icons/file/create-new-folder';
import ActionSettings from 'material-ui/svg-icons/action/settings';

// Ensure to always impor tthe container, and not the component
import FileListComponent from './components/fileList/fileList.container';
import FilePath from './components/filePath/filePath';

export default class FtpBrowser extends Component {

  // Declare our props
  // No comment is too dumb, imo
  // obj --> JSON Object, boolean --> true/false
  props: {
    transplant: obj,
    isLoading: obj,
    path: string,
    logout: () => void,
    uploadFile: () => void,
    makeDirectory: () => void
  }

  // Our constructor, where we shall be setting state
  constructor(props) {
    super(props);

    this.state = {
      makeDirectory: false,
      directoryName: ''
    };
  }

  // Function to handle files being chosen to be uploaded
  fileUpload = (event) => {
    if (!event ||
      !event.target ||
      !event.target.files ||
      event.target.files.length <= 0
    ) {
      return;
    }
    // Get the file path
    // https://discuss.atom.io/t/get-the-file-path-from-an-input/32672
    const localUploadFilePath = event.target.files[0].path;
    this.props.uploadFile(this.props.transplant, localUploadFilePath, this.props.path);
  }

  render() {
    // Get our file path
    let filePath;
    if (!this.props.path ||
    this.props.isLoading.goToDirectory) {
      filePath = (
        <LinearProgress mode="indeterminate" />
      );
    } else {
      filePath = (
        <FilePath
          path={this.props.path} />
      );
    }

    // Our make directory input
    let newDir;
    if (this.state.makeDirectory) {
      newDir = (
        <div className="ftp-browser__new-directory">
          <FileFolder className="ftp-browser__new-directory__icon" />
          <form
            className="ftp-browser__new-directory__form"
            onSubmit={(event) => {
              // Stop the default event
              event.preventDefault();
              // Clone our directory name from the state so it is not lost
              const directoryName = this.state.directoryName.slice(0);
              this.props.makeDirectory(this.props.transplant,
              this.props.path,
              directoryName);
              this.setState({
                makeDirectory: false,
                directoryName: ''
              });
            }}>
            <TextField
              floatingLabelText="New Directory Name"
              hintText="TransplantDir"
              autoFocus
              onBlur={() => {
                this.setState({
                  makeDirectory: false
                });
              }}
              onChange={(event) => {
                this.setState({
                  directoryName: event.target.value
                });
              }} />
          </form>
        </div>
      );
    } else {
      newDir = (
        <div />
      );
    }

    return (
      <div className="ftp-browser">

        <div className="ftp-browser__icon-row">
          <IconButton
            className="clickable ftp-browser__icon-row__logout"
            tooltip="Logout"
            containerElement={<Link to="/" />}
            onClick={this.props.logout}>
            <NavigationCancel />
          </IconButton>

          <IconButton
            className="clickable ftp-browser__icon-row__pending"
            tooltip="Pending Transfers"
            containerElement={<Link to="/pending" />}>
            <FileCloudQueue />
          </IconButton>

          <IconButton
            className="clickable ftp-browser__icon-row__upload"
            tooltip="Upload Here"
            containerElement="label">
            <FileFileUpload />
            <input
              className="ftp-browser__icon-row__upload__file-input"
              type="file"
              multiple="multiple"
              onChange={this.fileUpload} />
          </IconButton>

          <IconButton
            className="clickable ftp-browser__icon-row__new-folder"
            tooltip="New Directory"
            onClick={() => {
              this.setState({
                makeDirectory: true
              });
            }}>
            <FileCreateNewFolder />
          </IconButton>

          <IconButton
            className="clickable ftp-browser__icon-row__pending"
            tooltip="Settings"
            containerElement={<Link to="/settings" />}>
            <ActionSettings />
          </IconButton>
        </div>

        <div className="ftp-browser__file-path">
          {filePath}
        </div>

        <div className="ftp-browser__new-directory">
          {newDir}
        </div>

        <div className="ftp-browser__file-list">
          <FileListComponent />
        </div>
      </div>
    );
  }
}
