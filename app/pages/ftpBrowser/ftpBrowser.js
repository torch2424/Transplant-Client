import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
// Ensure to always impor tthe container, and not the component
import FileListComponent from './components/fileList/fileList.container';
import FilePath from './components/filePath/filePath';

export default class FtpBrowser extends Component {

  // Declare our props
  // No comment is too dumb, imo
  // obj --> JSON Object, boolean --> true/false
  props: {
    client: obj,
    isLoading: obj,
    path: string,
    getInitialDirectory: () => void,
    logout: () => void
  }

  // Our constructor, where we shall be setting state
  constructor(props) {
    super(props);

    // Call to get our current directory
    if (!this.props.path) {
      this.props.getInitialDirectory(this.props.client);
    }
  }

  // Function to handle files being chosen to be uploaded
  fileUpload = (event) => {
    // Get the file path
    // https://discuss.atom.io/t/get-the-file-path-from-an-input/32672
    console.log('File Upload!');
    console.log(event.target);
    console.log(event.target.files);
    console.log(event.target.files[0].path);
  }

  render() {
    let filePath;
    if (!this.props.path ||
    this.props.isLoading.getInitialDirectory ||
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

    return (
      <div className="ftp-browser">
        <div className="ftp-browser__logout">
          <Link to="/" onClick={this.props.logout}>Logout</Link>
        </div>

        <div className="ftp-browser__pending">
          <Link to="/pending">Pending Transfers</Link>
        </div>

        <div className="ftp-browser__file-path">
          {filePath}
        </div>

        <RaisedButton
          containerElement="label"
          label="Upload Here"
          primary >
          <input
            type="file"
            multiple="multiple"
            onChange={this.fileUpload}
            style={{ display: 'none' }} />
        </RaisedButton>

        <div className="ftp-browser__file-list">
          <FileListComponent />
        </div>
      </div>
    );
  }
}
