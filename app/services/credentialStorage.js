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
function _createKey(protocol, host, username, port) {
  // Using {{dot}} to replace the literal '.' to help with json storage
  host = host.replace(/\./g, '{{dot}}');
  return `${protocol}${username}@${host}:${port}`;
}

// Private function to return our decoded key for password and json
function _decodeKey(accountKey) {
  return accountKey.replace(/{{dot}}/g, '.');
}


/**
* Function to set the passed credentials
* @param protocol - Transplant Protocol
* @param host - Host address of the server
* @param username - username of the user on the server
* @param password - password of the user on the server
* @param port - port of the server that is running
* @returns Promise, rejects if could not set the password
*/
export function setCredentials(protocol, host, username, password, port) {
  return new Promise((resolve, reject) => {
    const accountKey = _createKey(protocol, host, username, port);

    // Create/Set our new credentials
    const account = {
      lastUsed: Date.now(),
      accountKey,
      decodedAccountKey: _decodeKey(accountKey),
      protocol,
      host,
      username,
      port
    };

    // Check if we need to create our update the account
    if (db.get('accounts').find({ accountKey }).value()) {
      db.get('accounts').find({ accountKey })
      .assign(account).write();
    } else {
      db.get('accounts')
      .push(account).write();
    }

    // Set our passwords
    keytar.setPassword(SERVICE_NAME, accountKey, password)
    .then(() => resolve())
    .catch((err) => reject(err));
  });
}

/**
* Function to return all accounts on the device, without passwords
*/
export function getAllAccounts() {
  // Get the accounts, sort by last used, and reverse as Date.now() returns EPOCH
  return db.get('accounts').sortBy('lastUsed').value().reverse();
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
        return reject('Could not get the password');
      }

      account.password = password;
      return resolve(account);
    }).catch((err) => reject(err));
  });
}
