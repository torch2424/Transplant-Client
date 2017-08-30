/**
* Credential Storage using node-keytar and lowdb
* https://github.com/atom/node-keytar
* https://github.com/typicode/lowdb
*/

// Get our localStorage using lowdb
const low = require('lowdb');
// Get our keytar
const keytar = require('keytar');
// Get some electron goodies
const app = require('electron').remote.app;

// Define our service const for keytar
const SERVICE_NAME = 'Transplant';
// Define our our db file
const DB_FILE = `${app.getPath('userData')}/transplant.json`;

// Set our db defaults
const db = low(DB_FILE);
// Set some defaults if your JSON file is empty
db.defaults({ accounts: [] })
  .write();

// Private function to return an encoded key for password and json
function _createKey(type, host, username, port) {
  // Using {{dot}} to replace the literal '.' to help with json storage
  host = host.replace(/\./g, '{{dot}}');
  return `${type}${username}@${host}:${port}`;
}

// Private function to return our decoded key for password and json
function _decodeKey(accountKey) {
  return accountKey.replace(/{{dot}}/g, '.');
}


/**
* Function to set the passed credentials
* @param type - Transplatn TYPE
* @param host - Host address of the server
* @param username - username of the user on the server
* @param password - password of the user on the server
* @param port - port of the server that is running
* @returns Promise, rejects if could not set the password
*/
export function setCredentials(type, host, username, password, port) {
  return new Promise((resolve, reject) => {
    const accountKey = _createKey(type, host, username, port);

    // Create/Set our new credentials
    if (db.get('accounts').find({ accountKey }).value()) {
      db.get('accounts').find({ accountKey })
      .assign({
        accountKey,
        decodedAccountKey: _decodeKey(accountKey),
        type,
        host,
        username,
        port
      }).write();
    } else {
      db.get('accounts')
      .push({
        accountKey,
        decodedAccountKey: _decodeKey(accountKey),
        type,
        host,
        username,
        port
      }).write();
    }

    // Set our passwords
    keytar.setPassword(SERVICE_NAME, accountKey, password).then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
* Function to return all accounts on the device, without passwords
*/
export function getAllAccounts() {
  return db.get('accounts').value();
}

/**
* Function to return an account with its password
* @param accountKey - the key that is assigned from the function _createKey()
* @returns Promise, rejects if could not get the password,
*     resolves with the account and its password
*/
export function getAccountWithPass(accountKey) {
  return new Promise((resolve, reject) => {
    // Using object.assign to avoid updating the db
    const account = Object.assign({},
        db.get('accounts').find({ accountKey }).value());
    keytar.getPassword(SERVICE_NAME, accountKey).then((password) => {
      if (!password) {
        reject('Could not get the password');
      }

      account.password = password;
      resolve(account);
    }).catch((err) => {
      reject(err);
    });
  });
}
