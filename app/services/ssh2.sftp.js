// Sftp Client API using ssh2
// https://github.com/mscdex/ssh2

import * as ssh from 'ssh2';

import { TRANSFER_TYPE } from './transplant';

// Private function to turn files in transplant friendly objects
function _digestFileListResponse(files) {
  return files.map((file) => ({
    fileName: file.filename,
    isDir: file.longname.charAt(0) === 'd'
  }));
}

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

        // Get our current directory and list
        const pathAndList = [
          getCurrentDirectory(client),
          listFiles(client, '.')
        ];

        Promise.all(pathAndList).then((res) => {
          resolve({
            client,
            path: res[0],
            list: res[1]
          });
        }).catch((err) => {
          reject(err);
        });
      });
    }).connect(credentials);
  });
}

/**
 * Function to get the current absolute path
 * @returns {Promise} - resolves:
 *    the current direcotry
 */
export function getCurrentDirectory(client) {
  return new Promise((resolve, reject) => {
    client.realpath('.', (pathErr, path) => {
      if (pathErr) {
        reject(pathErr);
      }

      resolve(path);
    });
  });
}

/**
 * Function to connect to the server.
 * @returns {Promise} - reolves:
 *    the directory listing
 */
export function listFiles(client, directory) {
  return new Promise((resolve, reject) => {
    // List the current directory
    client.readdir(directory, (listErr, list) => {
      if (listErr) {
        reject(listErr);
      }

      resolve(_digestFileListResponse(list));
    });
  });
}

/**
 * Function to change directories
 * @returns {Promise} - resolves:
 *    the new path, and the new directory listing
 */
export function changeDirectory(client, directory) {
  return new Promise((resolve, reject) => {
    // Read the user home directory
    client.opendir(directory, (cdErr) => {
      if (cdErr) {
        reject(cdErr);
      }

      // List our files
      listFiles(client, directory).then((list) => {
        resolve({
          directory,
          list
        });
      }).catch((listErr) => {
        reject(listErr);
      });
    });
  });
}

/**
 * Function to download a file
 * @returns {Promise} - resolves when finished
 */
export function downloadFile(client, remotePath, localPath, progressCallback) {
  return new Promise((resolve, reject) => {
    // Download the file
    client.fastGet(remotePath, localPath, {
      step: (transferProgress, fileChunk, totalSize) => {
        // Returns size in bytes.
        // So, / 1000000 for MB
        // / 1000000000 for GB
        // Or use preety bytes: https://www.npmjs.com/package/pretty-bytes
        progressCallback(localPath, TRANSFER_TYPE.GET, totalSize, transferProgress);
      }
    }, (err) => {
      if (err) {
        reject(err);
      }

      resolve({
        remotePath
      });
    });
  });
}
