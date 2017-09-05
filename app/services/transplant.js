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

/**
* Private function to compare two string for comparator fucntions
* @param aString - string of the a item
* @param bString - string of the b item
* @returns 1, 0, -1 for comparator function
*/
function _compareStrings(a, b) {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
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
  * @returns promise - resolves with the initial path and file listing,t
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

      connectResponse.then((client) => {
        // Set our client
        this.client = client;

        // Get our current path and list its files
        if (this.protocol === PROTOCOL.SFTP) {
          const pathAndList = [
            this.getCurrentDirectory(),
            this.listFiles('.')
          ];

          Promise.all(pathAndList).then(res => {
            const trailingSlashPath = _addTrailingSlashIfNotPresent(res[0]);
            const list = res[1];
            this.path = trailingSlashPath;
            resolve({
              client,
              path: trailingSlashPath,
              list
            });
          }).catch((pathAndListErr) => reject(pathAndListErr));
        } else if (this.protocol === PROTOCOL.FTP) {
          // JSFTP requires we get the absolute path first
          this.getCurrentDirectory().then(path => {
            this.listFiles(path).then(list => {
              resolve({
                client,
                path: _addTrailingSlashIfNotPresent(path),
                list
              });
            }).catch(listErr => reject(listErr));
          }).catch(dirErr => reject(dirErr));
        }
      }).catch((err) => reject(err));
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
        pathResponse = sftp.getCurrentDirectory(this.client);
      } else {
        console.log('Invalid connection protocol');
      }

      pathResponse
      .then((res) => resolve(_addTrailingSlashIfNotPresent(res)))
      .catch((err) => reject(err));
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
        console.error('Invalid connection protocol');
      }

      listResponse
      .then((res) => {
        // Sort files before resolving
        // Directories before files, A-Z
        res.sort((a, b) => {
          if (a.isDir && b.isDir) {
            return _compareStrings(a.fileName, b.fileName);
          } else if (a.isDir && !b.isDir) {
            return -1;
          } else if (!a.isDir && b.isDir) {
            return 1;
          }
          return _compareStrings(a.fileName, b.fileName);
        });
        resolve(res);
      })
      .catch((err) => reject(err));
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

      cdResponse
      .then(() => {
        this.listFiles(directory).then(list => resolve({
          directory,
          list
        })).catch((listErr) => reject(listErr));
      })
      .catch((err) => reject(err));
    });
  }

  /**
  * Function to download a file.
  * FTP Items are downloaded synchronously, SFTP Items are downloaded in parallel
  * @param remotePath - the path to the file to be downloded
  * @param localPath - Where the file should be downloaded to
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

      downloadResponse
      .then((res) => resolve(res))
      .catch((err) => reject(err));
    });
  }

  /**
  * Function to upload a file.
  * FTP Items are uploaded synchronously, SFTP Items are uploaded in parallel
  * @param remotePath - Where the file should be uploaded
  * @param localPath - the file to be uploaded
  * @param progressCallback - Function to be called whenever progress is made on the download.
  *     progressCallback accepts the params:
  *       filename - name of the remote file being transferred
  *       action - get for download, put for download
  *       total - total size of the transfer
  *       transferred - the amount currently transffered
  * @returns promise - resolves when finished,
  *   rejects with error
  */
  uploadFile(remotePath, localPath, progressCallback) {
    return new Promise((resolve, reject) => {
      let uploadResponse;
      if (this.protocol === PROTOCOL.FTP) {
        uploadResponse = ftp.uploadFile(this.client,
          remotePath, localPath, progressCallback);
      } else if (this.protocol === PROTOCOL.SFTP) {
        uploadResponse = sftp.uploadFile(this.client,
          remotePath, localPath, progressCallback);
      } else {
        console.log('Invalid connection protocol');
      }

      uploadResponse
      .then((res) => resolve(res))
      .catch((err) => reject(err));
    });
  }

  /**
  * Function to create a new directory on the server.
  * @param path - Where the path to be created
  * @returns promise - resolves when finished,
  *   rejects with error
  */
  makeDirectory(path) {
    return new Promise((resolve, reject) => {
      let mkdirResponse;
      if (this.protocol === PROTOCOL.FTP) {
        mkdirResponse = ftp.makeDirectory(this.client,
          path);
      } else if (this.protocol === PROTOCOL.SFTP) {
        mkdirResponse = sftp.makeDirectory(this.client,
          path);
      } else {
        console.log('Invalid connection protocol');
      }

      mkdirResponse
      .then((res) => resolve(res))
      .catch((err) => reject(err));
    });
  }
}
