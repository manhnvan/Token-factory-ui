import React, { useState, useEffect } from 'react'
import TokenCreateForm from '@component/TokenCreateForm'
import './styles/tokens.page.css'
import TokenCard from '@component/TokenCard'


export default function Tokens() {

    const [tokens, setTokens] = React.useState([])

    useEffect(() => {
        if (window.walletConnection.isSignedIn()) {
            window.contract.get_tokens({from_index: 0, limit: 10}).then((result) => {
                setTokens(result)
            })
        }
    }, [])

    return (
        <main>
            <div className="d-flex justify-content-between p-5">
                <div className="d-flex flex-column justify-content-center project-introduction">
                    <h1>Connesus</h1>
                    <p>Connect influencer to fans by blockchain</p>
                </div>
                <div className="token-create-form"> 
                    
                    <TokenCreateForm />
                </div>
            </div>
            <div className="d-flex justify-content-evenly flex-wrap mt-5 container">
                {tokens.map(token => (
                    <TokenCard token={token} key={token?.metadata?.symbol} />
                ))}
            </div>
        </main>
    )
}