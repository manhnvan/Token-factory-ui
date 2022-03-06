import React, {useState, useEffect} from "react";
import getConfig from '@config'
const { contractName } = getConfig(process.env.NODE_ENV || 'development')
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'

export default function useFtContract(accountId) {
    const [contract, setContract] = useState(null)

    const initContract = async () => {
        const contract = await new Contract(window.walletConnection.account(), `${accountId}.${contractName}`, {
            viewMethods: [
                'ft_balance_of',
                'ft_total_supply',

            ],
            changeMethods: [
                'storage_deposit',
                'ft_transfer',
                'mint',
                'withdraw'
            ],
        })
        setContract(contract)
    }

    useEffect(() => {
        if (window.walletConnection.account()) {
            initContract()
        }
    }, [])

    return {
        contract,
    }
}