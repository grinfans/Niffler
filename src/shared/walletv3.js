const axios = require('axios')
require('promise.prototype.finally').shim()
const crypto = require('crypto')
import fs from 'fs'
import {ownerApiSecretPath, grinWalletPath, platform} from './config'
import log from './logger'
import {exec, execFile} from 'child_process'

let client
let ecdh
let publicKey
let sharedSecret //hex string
let token

//https://docs.rs/grin_wallet_api/4.0.0/grin_wallet_api/trait.OwnerRpc.html

const walletHost = 'http://localhost:3420'
const jsonRPCUrl = 'http://localhost:3420/v3/owner'

function encrypt(key, text, nonce){
    //const nonce = new Buffer(crypto.randomBytes(12), 'utf8')
    const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce)
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
    const tag = cipher.getAuthTag()
    return Buffer.concat([encrypted, tag]).toString('base64')
}

function decrypt(key, data, nonce){
    //key,nonce is all buffer type; data is base64-encoded string
    const data_ = Buffer.from(data, 'base64')
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce)
    const len = data_.length
    const tag = data_.slice(len-16, len)
    const text = data_.slice(0, len-16)
    decipher.setAuthTag(tag)
    const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
    return decrypted
}

class WalletServiceV3 {
    static startOwnerApi(){
        let ownerAPI
        if(platform === 'linux'){
            ownerAPI = execFile(grinWalletPath, ['owner_api']) 
        }else{
            ownerAPI =  exec(`${grinWalletPath} owner_api`)
        }
        ownerAPI.stdout.on('data', (data)=>{
            log.debug('start owner_api got: ' + data)
        })
        ownerAPI.stderr.on('data', (data) => {
            log.error('start owner_api v3 got stderr: ' + data)
        })
    }

    static initClient() {
        if(fs.existsSync(ownerApiSecretPath)){
            client = axios.create({
                baseURL: walletHost,
                auth: {
                    username: 'grin',
                    password: fs.readFileSync(ownerApiSecretPath).toString()
                },
            })
        }else{
            client = axios.create({baseURL: walletHost})
        }
    }

    static post(method, params){
        const headers = {
            'Content-Type': 'application/json'
        }
        const body = {
            jsonrpc: '2.0',
            id: 1,
            method: method,
            params: params,
        }
        return client.post(jsonRPCUrl, body, headers)
    }

    static postEncrypted(method, params){
        if(!sharedSecret)return
        const body = {
            jsonrpc: '2.0',
            id: 1,
            method: method,
            params: params,
        }
        //console.log('post body: ' + JSON.stringify(body))
        const nonce = crypto.randomBytes(12)
        const key = Buffer.from(sharedSecret,'hex')
        const bodyEncrypted = encrypt(key, JSON.stringify(body), nonce)
        return new Promise((resolve, reject)=>{
            WalletServiceV3.post('encrypted_response_v3', {
                'nonce': nonce.toString('hex'),
                'body_enc': bodyEncrypted
            }).then(res=>{
                //console.log('postEncrypted return: ' + JSON.stringify(res.data))
                const nonce2 = Buffer.from(res.data.result.Ok.nonce, 'hex')
                const data = Buffer.from(res.data.result.Ok.body_enc, 'base64')
                const decrypted = decrypt(key, data, nonce2)
                //console.log('decrypted:' + decrypted)
                resolve(JSON.parse(decrypted))
            }).catch(err=>{
                reject(err)        
            })
        })
    }
    static initSecureAPI(){
        ecdh = crypto.createECDH('secp256k1')
        ecdh.generateKeys()
        publicKey = ecdh.getPublicKey('hex', 'compressed')
        //console.log('publickey: ' + publicKey)
        return WalletServiceV3.post('init_secure_api', {
            'ecdh_pubkey': publicKey
        })
    }

    static initSharedSecret(){
        return new Promise((resolve, reject)=>{
            WalletServiceV3.initSecureAPI().then((res)=>{
                //log.debug('initSharedSecret return: ' + JSON.stringify(res))
                const remotePublicKey = res.data.result.Ok
                sharedSecret = ecdh.computeSecret(remotePublicKey, 'hex', 'hex')
                //console.log('sharedSecret: ' + sharedSecret)
                resolve(res)
            }).catch((err)=>{
                reject(err)
            })
        })
    }

    static getTopLevelDirectory(){
        return WalletServiceV3.postEncrypted('get_top_level_directory', {})
    }

    static createConfig(chainType, walletConfig, loggingConfig, torConfig){
        return WalletServiceV3.postEncrypted('create_config', {
            'chain_type': chainType,
            'wallet_config': walletConfig,
            'logging_config': loggingConfig,
            'tor_config': torConfig
        })
    }

    static createWallet(name, mnemonic, mnemonicLength, password){
        return WalletServiceV3.postEncrypted('create_wallet', {
            'name': name,
            'mnemonic': mnemonic,
            'mnemonic_length': mnemonicLength,
            'password': password
        })
    }

    static openWallet(name, password){
        return new Promise((resolve, reject)=>{
            WalletServiceV3.postEncrypted('open_wallet', {
                'name': name,
                'password': password
            }).then((res)=>{
                //log.debug('open_wallet return: ' + JSON.stringify(res))
                token = res.result.Ok
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    }

    static isWalletOpened(){
        if(token)return true
        return false
    }
    
    static getNodeHeight(){
        if(!token)return
        return WalletServiceV3.postEncrypted('node_height', {
            'token': token
        })
    }

    static getAccounts(){
        if(!token)return
        return WalletServiceV3.postEncrypted('accounts', {
            'token': token
        })
    }

    static getSummaryInfo(refresh_from_node, minimum_confirmations){
        if(!token)return
        return WalletServiceV3.postEncrypted('retrieve_summary_info', {
            'token': token,
            'refresh_from_node': refresh_from_node,
            'minimum_confirmations': minimum_confirmations
        })
    }

    static getTransactions(refresh_from_node, tx_id, tx_slate_id){
        if(!token)return
        return WalletServiceV3.postEncrypted('retrieve_txs', {
            'token': token,
            'refresh_from_node': refresh_from_node,
            "tx_id": tx_id,
			"tx_slate_id": tx_slate_id,
        })
    }

    static getCommits(refresh_from_node, include_spent, tx_id){
        if(!token)return
        return WalletServiceV3.postEncrypted('retrieve_outputs', {
            'token': token,
            'refresh_from_node': refresh_from_node,
            'include_spent': include_spent,
            'tx_id': tx_id
        })
    }

    static cancelTransactions(tx_id, tx_slate_id){
        if(!token)return
        return WalletServiceV3.postEncrypted('cancel_tx', {
            'token': token,
            'tx_id': tx_id,
            'tx_slate_id': tx_slate_id
        })
    }

    static issueSendTransaction(tx_data){
        if(!token)return
        return WalletServiceV3.postEncrypted('init_send_tx', {
            'token': token,
            'args': tx_data
        })
    }

    static lockOutputs(slate){
        if(!token)return
        return WalletServiceV3.postEncrypted('tx_lock_outputs', {
            'token': token,
            'slate': slate
        })
    }

    static finalizeTransaction(slate){
        if(!token)return
        return WalletServiceV3.postEncrypted('finalize_tx', {
            'token': token,
            'slate': slate
        })
    }

    static postTransaction(slate, is_fluff){
        if(!token)return
        return WalletServiceV3.postEncrypted('post_tx', {
            'token': token,
            'slate': slate,
            'fluff': is_fluff
        })
    }

    static startUpdater(freq){
        if(!token)return
        return WalletServiceV3.postEncrypted('start_updater', {
            'token': token,
            'frequency': freq,
        })
    }

    static getUpdaterMessages(count){
        if(!token)return
        return WalletServiceV3.postEncrypted('get_updater_messages', {
            'count': count,
        })
    }

    static getSlatepackAddress(derivation_index){
        if(!token)return
        return WalletServiceV3.postEncrypted('get_slatepack_address', {
            'token': token,
            'derivation_index': derivation_index,
        })
    }

    static createSlatepackMessage(slate, sender_index, recipients){
        if(!token)return
        return WalletServiceV3.postEncrypted('create_slatepack_message', {
            'token': token,
            'sender_index': sender_index,
            'recipients': recipients,
            'slate': slate
        })
    }

    static decodeSlatepackMessage(message, secret_indices){
        if(!token)return
        return WalletServiceV3.postEncrypted('decode_slatepack_message', {
            'token': token,
            'message':message,
            'secret_indices': secret_indices
        })
    }

    static getSlateFromSlatepackMessage(message, secret_indices){
        if(!token)return
        return WalletServiceV3.postEncrypted('slate_from_slatepack_message', {
            'token': token,
            'message':message,
            'secret_indices': secret_indices
        })
    }

}

WalletServiceV3.initClient()
export default WalletServiceV3