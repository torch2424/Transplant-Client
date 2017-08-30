// Ftp Client API using jsftp
// https://github.com/mscdex/ssh2

import * as JSFtp from 'jsftp';

/**
 * Function to connect to the server.
 * @returns {Promise} - reolves:
 *    the client interface, current absolute path, and the directory listing
 */
export function connect(host, username, password, port) {
  return new Promise((resolve, reject) => {
    // Get our ftp credentials
    const credentials = {
      host
    };

    // Check for option params
    if (username) {
      credentials.username = username;
    }
    if (password) {
      credentials.password = password;
    }
    if (port) {
      credentials.port = port;
    }

    const client = new JSFtp(credentials);

    client.on('error', (connectErr) => {
      console.log(connectErr);
      reject(connectErr);
    });

    client.on('connect', () => {
      // List the current directory
      client.raw('pwd', (pathErr, path) => {
        if (pathErr) {
          reject(pathErr);
        }

        // List the files within the current directory
        client.ls('.', (err, list) => {
          // Resolve with out info
          resolve({
            client,
            path,
            list
          });
        });
      });
    });
  });
}
