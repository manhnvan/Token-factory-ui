import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract() {
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  window.accountId = window.walletConnection.getAccountId()
  window.account = window.walletConnection.account();

  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    viewMethods: [
      'get_min_attached_balance',
      'get_required_deposit',
      'get_number_of_tokens',
      'get_tokens',
      'get_token',
  ],
  changeMethods: [
      'storage_deposit',
      'create_token'
  ],
  })
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName)
}
