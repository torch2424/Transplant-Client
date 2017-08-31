/*!
 * transplant.js - https://aaronthedev.com
 * Version - 1.0.0
 * Licensed under the Apache 2.0 license - https://choosealicense.com/licenses/apache-2.0/
 *
 * Copyright (c) 2017 Aaron Turner
 */

// Wrapper for various File Transfer Protocols
// ssh2
// jsftp: https://github.com/sergi/jsftp/blob/master/lib/jsftp.js
// use jsftp emit to track progress :)

import * as sftp from './ssh2.sftp';
import * as ftp from './jsftp.ftp';

export const PROTOCOL = {
  FTP: 'ftp://',
  SFTP: 'sftp://'
};

export const TRANSFER_TYPE = {
  GET: 'GET',
  PUT: 'PUT'
};

/**
* Private function to add trailing slashes to our path
* @param path - string of the path
* @returns a path with a trailing slash
*/
function _addTrailingSlashIfNotPresent(path) {
  // Check the last character of the path for a slash
  if (path.substr(-1) !== '/') {
    const trailingSlashPath = `${path}/`;
    return trailingSlashPath;
  }

  return path;
}

export class Transplant {
  protocol: string
  client: obj
  path: string

  constructor(protocol) {
    this.protocol = protocol;
  }

  /**
  * Function to create a connection to the server, and assign our client object
  * @param host - Host address of the server
  * @param username - username of the user on the server
  * @param password - password of the user on the server
  * @param port - port of the server that is running
  * @returns promise - resolves with the initial path and file listing,
  *   rejects with error
  */
  connect(host, username, password, port) {
    return new Promise((resolve, reject) => {
      // Call the connect of the appropriate protocol.
      // Must return a promise
      let connectResponse;
      if (this.protocol === PROTOCOL.FTP) {
        connectResponse = ftp.connect(host, username, password, port);
      } else if (this.protocol === PROTOCOL.SFTP) {
        connectResponse = sftp.connect(host, username, password, port);
      } else {
        console.log('Invalid connection protocol');
      }

      connectResponse.then((res) => {
        const trailingSlashPath = _addTrailingSlashIfNotPresent(res.path);
        this.client = res.client;
        this.path = trailingSlashPath;
        resolve({
          path: trailingSlashPath,
          list: res.list
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
  * Function to return/update the current path
  * @returns promise - resolves with the string of the current path,
  *   rejects with error
  */
  getCurrentDirectory() {
    return new Promise((resolve, reject) => {
      let pathResponse;
      if (this.protocol === PROTOCOL.FTP) {
        pathResponse = ftp.getCurrentDirectory(this.client);
      } else if (this.protocol === PROTOCOL.SFTP) {
        pathResponse = sftp.listFiles(this.client);
      } else {
        console.log('Invalid connection protocol');
      }

      pathResponse.then((res) => {
        resolve(_addTrailingSlashIfNotPresent(res));
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
  * Function return an array of items that are within the current directory
  * @param directory - the directory to list, optional, wiil use the current if one is not passed
  * @returns promise - resolves with the array of items,
  *   rejects with error
  */
  listFiles(directory) {
    if (!directory) {
      directory = this.path;
    }

    return new Promise((resolve, reject) => {
      let listResponse;
      if (this.protocol === PROTOCOL.FTP) {
        listResponse = ftp.listFiles(this.client, directory);
      } else if (this.protocol === PROTOCOL.SFTP) {
        listResponse = sftp.listFiles(this.client, directory);
      } else {
        console.log('Invalid connection protocol');
      }

      listResponse.then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
  * Function to go to another directory
  * @param directory - the directory to navigate to
  * @returns promise - resolves with the new path and list of items,
  *   rejects with error
  */
  changeDirectory(directory) {
    return new Promise((resolve, reject) => {
      let cdResponse;
      if (this.protocol === PROTOCOL.FTP) {
        cdResponse = ftp.changeDirectory(this.client, directory);
      } else if (this.protocol === PROTOCOL.SFTP) {
        cdResponse = sftp.changeDirectory(this.client, directory);
      } else {
        console.log('Invalid connection protocol');
      }

      cdResponse.then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
  * Function to download a file.
  * FTP Items are downloaded synchronously, SFTP Items are downloaded in parallel
  * @param path - the path to the file to be downloded
  * @param progressCallback - Function to be called whenever progress is made on the download.
  *     progressCallback accepts the params:
  *       filename - name of the file being transferred
  *       action - get for download, put for download
  *       total - total size of the transfer
  *       transferred - the amount currently transffered
  * @returns promise - resolves when finished,
  *   rejects with error
  */
  downloadFile(remotePath, localPath, progressCallback) {
    return new Promise((resolve, reject) => {
      let downloadResponse;
      if (this.protocol === PROTOCOL.FTP) {
        downloadResponse = ftp.downloadFile(this.client,
          remotePath, localPath, progressCallback);
      } else if (this.protocol === PROTOCOL.SFTP) {
        downloadResponse = sftp.downloadFile(this.client,
          remotePath, localPath, progressCallback);
      } else {
        console.log('Invalid connection protocol');
      }

      downloadResponse.then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
