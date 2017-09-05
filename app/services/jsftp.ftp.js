// Ftp Client API using jsftp
// https://github.com/mscdex/ssh2
// NOTE: Can't execute multiple commands at the same time :/

import { TRANSFER_TYPE } from './transplant';

const JSFtp = require('jsftp');

// Private function to return the absolute path from pwd
function _getPathFromPwd(pwdString) {
  const start = pwdString.indexOf('"') + 1;
  const end = pwdString.indexOf('"', start);
  return pwdString.substring(start, end);
}

// Private function to turn files in transplant friendly objects
function _digestFileListResponse(files) {
  return files.map((file) => ({
    fileName: file.name,
    isDir: file.type === 1
  }));
}

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
      credentials.user = username;
    }
    if (password) {
      credentials.pass = password;
    }
    if (port) {
      credentials.port = port;
    }

    const client = new JSFtp(credentials);

    client.on('error', (connectErr) => reject(connectErr));

    client.on('connect', () => {
      resolve(client);
    });
  });
}

/**
 * Function to get the current absolute path
 * @returns {Promise} - resolves:
 *    the current direcotry
 */
export function getCurrentDirectory(client) {
  return new Promise((resolve, reject) => {
    // List the current directory
    client.raw('pwd', (pathErr, path) => {
      if (pathErr) {
        return reject(pathErr);
      }

      return resolve(_getPathFromPwd(path.text));
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
    client.ls(directory, (listErr, list) => {
      if (listErr) {
        return reject(listErr);
      }

      // Digest our list
      return resolve(_digestFileListResponse(list));
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
    // CWD from the standard, which is documented better here:
    // https://github.com/mscdex/node-ftp
    client.raw('cwd', directory, (cdErr) => {
      if (cdErr) {
        return reject(cdErr);
      }

      resolve(directory);
    });
  });
}

/**
 * Function to download a file
 * @returns {Promise} - resolves when finished
 */
export function downloadFile(client, remotePath, localPath, progressCallback) {
  return new Promise((resolve, reject) => {
    // List the file to get some of its properties,
    // The total does not work in jsftp :p
    client.ls(remotePath, (listErr, list) => {
      if (listErr) {
        return reject(listErr);
      }

      // Download the file
      client.get(remotePath, localPath, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve({
          remotePath
        });
      });

      // Start watching our progress
      client.on('progress', (progress) => {
        // Save our total file size
        let totalSize;
        if (progress.totalSize && progress.totalSize > 0) {
          totalSize = progress.totalSize;
        } else if (list.length > 0) {
          totalSize = parseInt(list[0].size, 10);
        }
        progressCallback(localPath, TRANSFER_TYPE.GET, totalSize, progress.transferred);
      });
    });
  });
}

/**
 * Function to upload a file
 * @returns {Promise} - resolves when finished
 */
export function uploadFile(client, remotePath, localPath, progressCallback) {
  return new Promise((resolve, reject) => {
      // Download the file
    client.put(localPath, remotePath, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve({
        remotePath
      });
    });

      // Start watching our progress
    client.on('progress', (progress) => {
      // Currently, can't get transfer progress
      // https://github.com/sergi/jsftp/issues/124
      // Set to false in the meantime
      const transferred = false;
      progressCallback(remotePath, TRANSFER_TYPE.PUT, progress.totalSize, transferred);
    });
  });
}

/**
 * Function to create a new directory
 * @returns {Promise} - resolves when finished
 */
export function makeDirectory(client, path) {
  return new Promise((resolve, reject) => {
    client.raw('mkd', path, (err) => {
      if (err) {
        reject(err);
      }

      resolve(path);
    });
  });
}
