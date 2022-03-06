import React, {useState, useEffect} from 'react'
import './style.css'
import {tokenMetadataCreate} from '@utils/token.utils'
import {storeFiles} from '@utils/web3.storage'
import {DEFAULT_DECIMALS} from '@constants/standard.constant'

export default function TokenCreateForm() {
    const [tokenArgs, setTokenArgs] = useState({})
    const createTokens = async () => {
        const {name, symbol, logo, supply} = tokenArgs
        if (!name || !symbol || !logo || !supply) {
            alert('Please fill out the form')
        }
        const accountId = window.accountId
        try {
            const cid = await storeFiles([logo])
            const logoURL = `https://${cid}.ipfs.dweb.link/${logo.name}`
            const tokenMetadata = tokenMetadataCreate(name, symbol, logoURL)
            const argsList = {
                owner_id: accountId,
                total_supply: (supply * DEFAULT_DECIMALS).toString(),
                metadata: tokenMetadata
            }
            const minRequiredDeposit = await window.contract.get_required_deposit({args: argsList, account_id: accountId})
        
            await window.contract.create_token({
                args: argsList
            }, "300000000000000", minRequiredDeposit.toString())
        } catch(error) {
            console.log(error)
        }
    } 
    return (
        <>
        <div className="form form-create-token row">
            <h2>CREATE TOKEN</h2>
            <div className="form-group">
                <label className="form-label" htmlFor="name">Token's name </label>
                <input className="form-control" onChange={(event) => setTokenArgs({...tokenArgs, name: event.target.value})} type="text" name="token" id="name" placeholder="Token's name" />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="logo">Token's logo </label>
                <input className="form-control" 
                onChange={(event) => setTokenArgs({...tokenArgs, logo: event.target.files[0]})} 
                type="file" 
                name="token" 
                id="logo" 
                placeholder="Token's logo" 
                accept="image/*"
                />
            </div>
            <div className="form-group col-6">
                <label className="form-label" htmlFor="symbol">Symbol </label>
                <input className="form-control" onChange={(event) => setTokenArgs({...tokenArgs, symbol: event.target.value})} type="text" name="token" id="symbol" placeholder="Token's symbol" />
            </div>
            <div className="form-group col-6">
                <label className="form-label" htmlFor="supply">Initial Supply </label>
                <input className="form-control" onChange={(event) => setTokenArgs({...tokenArgs, supply: event.target.value})} type="number" name="token" id="supply" placeholder="Token's initial supply" />
            </div>
            <button className="btn btn-warning form-create-submit" onClick={() => createTokens()}>Create</button>
        </div>
        </>
    )
}