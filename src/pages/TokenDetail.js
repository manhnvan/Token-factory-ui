import React, { useState, useEffect } from 'react'
import TokenCreateForm from '@component/TokenCreateForm'
import './styles/tokenDetail.page.css'
import {
    useParams
} from "react-router-dom";
import useFtContract from "@hooks/useFtContract";
import getConfig from '@config'
const { contractName } = getConfig(process.env.NODE_ENV || 'development')
import shovel from '@assets/shovel.png'
import send from '@assets/send.png'
import withdraw from '@assets/money.png'
import receive from '@assets/receive.png'
import {yoktoNear} from '@utils/funcs' 
import { utils, transactions } from "near-api-js";
import {Decimal} from "decimal.js";

export default function Tokens() {

    let { tokenId } = useParams();
    const [tokenDetail, setTokenDetail] = useState({})
    const [balance, setBalance] = useState(0)
    const {contract, getFtBalance} = useFtContract(tokenId)
    const [currentAction, setAction] = useState('send')
    const [actionAddress, setActionAddress] = useState('')
    const [actionValue, setActionValue] = useState('')
    const [totalSupply, setTotalSupply] = useState(0)

    useEffect(() => {
        if (tokenId) {
            window.contract.get_token({token_id: `${tokenId.toLowerCase()}`}).then((tokenDetail) => {
                console.log(tokenDetail)
                setTokenDetail(tokenDetail)
            })
        }
    }, [tokenId])

    useEffect(() => {
        if (contract) {
            contract.ft_balance_of({account_id: window.accountId}).then((balance) => {
                setBalance(balance)
            })
            contract.ft_total_supply().then((balance) => {
                setTotalSupply(balance)
            })
        }
    }, [contract])

    const handleCancel = () => {
        setActionAddress('')
        setActionValue('')
    }

    const handleTransfer = async () => {
        if (!actionAddress || !actionValue || parseInt(actionValue) < 1) {
            alert('Please fill out the form')
        } else {
            console.log(contract)
            const result = await window.account.signAndSendTransaction({
                receiverId: contract.contractId,
                actions: [
                    transactions.functionCall(
                        'storage_deposit', 
                        {account_id: actionAddress},
                        10000000000000, 
                        utils.format.parseNearAmount("0.01")
                    ),
                    transactions.functionCall(
                        'ft_transfer', 
                        {
                            receiver_id: actionAddress, 
                            amount: (actionValue * Math.pow(10, tokenDetail?.metadata?.decimals || 0)).toString(), 
                            memo: null 
                        }, 
                        250000000000000,
                        1
                    )
                ]
            });
        }
    }

    const handleMint = async () => {
        if (!actionAddress || !actionValue || parseInt(actionValue) < 1) {
            alert('Please fill out the form')
        } else {
            const result = await window.account.signAndSendTransaction({
                receiverId: contract.contractId,
                actions: [
                    transactions.functionCall(
                        'storage_deposit', 
                        {account_id: actionAddress},
                        10000000000000, 
                        utils.format.parseNearAmount("0.01")
                    ),
                    transactions.functionCall(
                        'mint', 
                        {
                            account_id: actionAddress, 
                        }, 
                        250000000000000,
                        actionValue * Math.pow(10, tokenDetail?.metadata?.decimals || 0)
                    )
                ]
            });
        }
    }

    const handleWithdraw = async () => {
        const burnValue = parseInt(actionValue) * Math.pow(10, tokenDetail?.metadata?.decimals || 0)
        const burnValueJSON = JSON.stringify(burnValue)
        await contract.withdraw({amount: burnValueJSON});
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-center p-5">
                <div className="token-detail">
                    <div className="token-detail-info d-flex justify-content-between">
                        <div className="d-flex">
                            <div className="token-logo d-flex flex-column justify-content-center">
                                <img src={tokenDetail?.metadata?.icon} alt="icon" />
                            </div>
                            <div className="token-metadata d-flex flex-column justify-content-center">
                                <div className="token-symbol">{tokenDetail?.metadata?.symbol.toUpperCase()}</div>
                                <div className="token-name">{tokenDetail?.metadata?.name}</div>
                            </div>
                        </div>
                        
                    </div>
                    <br />
                    <div>
                        <button 
                            className="token-spec btn-success btn btn-sm"
                            data-bs-toggle="tooltip" 
                            data-bs-placement="top" 
                            title="Contract address"
                        >{`${tokenDetail?.metadata?.symbol.toLowerCase()}.${contractName}`}</button>
                        <button 
                            className="token-owner btn-danger btn btn-sm"
                            data-bs-toggle="tooltip" 
                            data-bs-placement="top" 
                            title="Contract owner"
                        >{tokenDetail?.owner_id}</button>
                    </div>
                    <div className="token-supply d-flex flex-column justify-content-center mt-3">
                        <div className="token-balance">Your balance: {balance / Math.pow(10, tokenDetail?.metadata?.decimals || 0)}</div>
                        <div className="token-supply">Total supply: {totalSupply / Math.pow(10, tokenDetail?.metadata?.decimals || 0)}</div>
                    </div>
                    <br />
                    <div className="token-actions d-flex flex-wrap justify-content-around">
                        <div className={`action ${currentAction === 'send' ? 'active' : ''}`} onClick={() => setAction('send')}>
                            <div className="action-logo">
                                <img src={send} alt="send"/>
                            </div>
                            <div className="action-title">Send</div>
                        </div>
                        {/* <div className={`action ${currentAction === 'receive' ? 'active' : ''}`} onClick={() => setAction('receive')}>
                            <div className="action-logo">
                                <img src={receive} alt="send"/>
                            </div>
                            <div className="action-title">Receive</div>
                        </div> */}
                        <div className={`action ${currentAction === 'mint' ? 'active' : ''}`} onClick={() => setAction('mint')}>
                            <div className="action-logo">
                                <img src={shovel} alt="send"/>
                            </div>
                            <div className="action-title">Mint</div>
                        </div>
                        <div className={`action ${currentAction === 'burn' ? 'active' : ''}`} onClick={() => setAction('burn')}>
                            <div className="action-logo">
                                <img src={withdraw} alt="send"/>
                            </div>
                            <div className="action-title">Burn</div>
                        </div>
                    </div>
                    <br />
                    {currentAction === 'send' && <div className="send-token action-detail d-flex flex-column text-center mt-3">
                        <h1>Send {tokenDetail?.metadata?.symbol.toUpperCase()}</h1>
                        <div className="token-logo d-flex justify-content-center mt-5">
                            <img src={tokenDetail?.metadata?.icon} alt="icon" />
                        </div>
                        <div className="action-form mt-5">
                            <div className="input-group mb-3">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Receiver's address" 
                                    aria-label="Username" 
                                    aria-describedby="basic-addon1" 
                                    onChange={(event) => setActionAddress(event.target.value)}
                                    value={actionAddress}
                                />
                            </div>
                            <div className="input-group mb-3">
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    placeholder="Amount" 
                                    aria-label="Username" 
                                    aria-describedby="basic-addon1" 
                                    onChange={(event) => setActionValue(event.target.value)}
                                    value={actionValue}
                                    min="0"
                                />
                            </div>
                            <div className="token-action-buttons row ">
                                <div className="col-6"><button onClick={handleTransfer} type="button" className="btn btn-success">Send</button></div>
                                <div className="col-6"><button onClick={handleCancel} type="button" className="btn btn-danger">Cancel</button></div>
                            </div>
                        </div>
                    </div>}

                    {currentAction === 'mint' && <div className="send-token action-detail d-flex flex-column text-center mt-3">
                        <h1>Mint {tokenDetail?.metadata?.symbol.toUpperCase()}</h1>
                        <div className="token-logo d-flex justify-content-center mt-5">
                            <img src={tokenDetail?.metadata?.icon} alt="icon" />
                        </div>
                        <div className="action-form mt-5">
                            <div className="input-group mb-3">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Receiver's address" 
                                    aria-label="Username" 
                                    aria-describedby="basic-addon1" 
                                    onChange={(event) => setActionAddress(event.target.value)}
                                    value={actionAddress}
                                />
                            </div>
                            <div className="input-group mb-3">
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    placeholder="Amount" 
                                    aria-label="Username" 
                                    aria-describedby="basic-addon1" 
                                    onChange={(event) => setActionValue(event.target.value)}
                                    value={actionValue}
                                    min="0"
                                />
                            </div>
                            <div className="token-action-buttons row ">
                                <div className="col-6"><button onClick={handleMint} type="button" className="btn btn-success">Mint</button></div>
                                <div className="col-6"><button onClick={handleCancel} type="button" className="btn btn-danger">Cancel</button></div>
                            </div>
                        </div>
                    </div>}

                    {currentAction === 'burn' && <div className="send-token action-detail d-flex flex-column text-center mt-3">
                        <h1>Burn {tokenDetail?.metadata?.symbol.toUpperCase()}</h1>
                        <div className="token-logo d-flex justify-content-center mt-5">
                            <img src={tokenDetail?.metadata?.icon} alt="icon" />
                        </div>
                        <div className="action-form mt-5">
                            <div className="input-group mb-3">
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    placeholder="Amount" 
                                    aria-label="Username" 
                                    aria-describedby="basic-addon1" 
                                    onChange={(event) => setActionValue(event.target.value)}
                                    value={actionValue}
                                    min="0"
                                />
                            </div>
                            <div className="token-action-buttons row ">
                                <div className="col-6"><button onClick={handleWithdraw} type="button" className="btn btn-success">Burn</button></div>
                                <div className="col-6"><button onClick={handleCancel} type="button" className="btn btn-danger">Cancel</button></div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}