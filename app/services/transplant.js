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

export const TYPE = {
  FTP: 'ftp://',
  SFTP: 'sftp://'
};

export class Transplant {
  type: string
  client: obj

  constructor(type) {
    this.type = type;
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
      // Call the connect of the appropriate type.
      // Must return a promise
      let connectResponse;
      if (this.type === TYPE.FTP) {
        connectResponse = ftp.connect(host, username, password, port);
      } else if (this.type === TYPE.SFTP) {
        connectResponse = sftp.connect(host, username, password, port);
      } else {
        console.log('Invalid connection type');
      }

      connectResponse.then((res) => {
        this.client = res.client;
        resolve({
          path: res.path,
          list: res.list
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
