import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LinearProgress from 'material-ui/LinearProgress';
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

        <div className="ftp-browser__file-list">
          <FileListComponent />
        </div>
      </div>
    );
  }
}
