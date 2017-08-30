// Sftp Client API using ssh2
// https://github.com/mscdex/ssh2

import * as ssh from 'ssh2';

/**
 * Function to connect to the server.
 * @returns {Promise} - reolves:
 *    the client interface, current absolute path, and the directory listing
 */
export function connect(host, username, password, port) {
  return new Promise((resolve, reject) => {
    // Create our new ssh client
    const sshClient = new ssh.Client();

    // Get our ssh credentials
    const credentials = {
      username,
      password,
      host,
      port: 22
    };

    if (port) {
      credentials.port = port;
    }

    sshClient.on('ready', () => {
      sshClient.sftp((connectErr, client) => {
        if (connectErr) {
          reject(connectErr);
        }

        // Read the current directory absPath
        client.realpath('.', (pathErr, path) => {
          if (pathErr) {
            throw pathErr;
          }

          // List the current directory
          client.readdir(path, (listErr, list) => {
            if (listErr) {
              throw listErr;
            }

            // Finally Resolve all of our information
            resolve({
              client,
              path,
              list
            });
          });
        });
      });
    }).connect(credentials);
  });
}
