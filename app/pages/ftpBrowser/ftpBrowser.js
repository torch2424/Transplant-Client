import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// Ensure to always impor tthe container, and not the component
import FileListComponent from './components/fileList/fileList.container';

export default class FtpBrowser extends Component {

  // Declare our props
  // No comment is too dumb, imo
  // obj --> JSON Object, boolean --> true/false
  props: {
    client: obj,
    isLoading: boolean
  }

  render() {
    return (
      <div>
        <div>
          <Link to="/">Logout</Link>
        </div>

        <h1>Hello! I am the FTP Browser Page</h1>

        <FileListComponent />
      </div>
    );
  }
}
