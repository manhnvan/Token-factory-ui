import {FT_METADATA_SPEC} from '@constants/standard.constant'

export const tokenMetadataCreate = (name, symbol, icon, reference, reference_hash, decimals) => {
    return {
        spec: FT_METADATA_SPEC,
        name: name,
        symbol: symbol,
        icon: icon,
        reference: reference || null,
        reference_hash: reference_hash || null,
        decimals: decimals || 8,
    }
}