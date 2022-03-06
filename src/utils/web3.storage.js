import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGRhMjM1MDYwZUVkNWZBOERFMjlFMjAwN2QwNDkzMEExNGE1ZEZhNjgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzMwNzcxOTU5NzYsIm5hbWUiOiJtYW5obnZfdGVzdCJ9.upuMLynlXF32CxbGpe2MG0DscV8ivvBGyxPPa3ehj50"

function makeStorageClient(TOKEN) {
    return new Web3Storage({ token: TOKEN })
}

async function storeFiles(files) {
    const client = makeStorageClient(TOKEN)
    const cid = await client.put(files)
    return cid
}

async function retrieveFiles(cid) {
    const client = makeStorageClient(TOKEN)
    const res = await client.get(cid)
    console.log(`Got a response! [${res.status}] ${res.statusText}`)
    if (!res.ok) {
        throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
    }

    // unpack File objects from the response
    const files = await res.files()
    return files
}

async function retrieve(cid) {
    const client = makeStorageClient(TOKEN)
    const res = await client.get(cid)
    console.log(`Got a response! [${res.status}] ${res.statusText}`)
    if (!res.ok) {
        throw new Error(`failed to get ${cid}`)
    }
}

async function checkFileStatus(TOKEN, cid) {
    const client = makeStorageClient(TOKEN)
    const status = await client.status(cid)
    if (status) {
        console.log(status)
    }
}

module.exports = {
    makeStorageClient,
    storeFiles,
    retrieve,
    retrieveFiles,
    checkFileStatus
}