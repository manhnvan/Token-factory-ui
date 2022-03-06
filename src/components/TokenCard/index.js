import React, { useState, useEffect } from "react";
import './style.css'
import getConfig from '@config'
import {
    Link
} from "react-router-dom";
const { contractName } = getConfig(process.env.NODE_ENV || 'development')

export default function TokenCard({token}) {
    
    const {metadata, owner_id, total_supply} = token

    const {icon, name, symbol, spec} = metadata

    return (
        <>
        <Link to={`/${symbol.toLowerCase()}`}>
            <div className="token-card">
                <div className="token-icon-place">
                    <img src={icon} alt="token-icon" className="token-icon" />
                </div>
                <div className="token-name">
                    {name}
                </div>
                <div className="token-owner">
                    {owner_id}
                </div>
            </div>
        </Link>
        </>
    )
}