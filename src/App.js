import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import getConfig from './config'
import TokenPage from '@page/Tokens'
import TokenDetailPage from '@page/TokenDetail'
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

const { networkId, contractName } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {


  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button className="link btn btn-warning" onClick={login}>Sign in</button>
        </p>
      </main>
    )
  }

  return (
    <>
      <div className="d-flex justify-content-end">
        <div className="dropdown">
          <button className="btn btn-warning dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            {window.accountId}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li onClick={logout}><a className="dropdown-item" href="#">Sign out</a></li>
          </ul>
        </div>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/:tokenId" element={<TokenDetailPage />} />
        </Routes>
        <Routes>
          <Route path="/" element={<TokenPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
