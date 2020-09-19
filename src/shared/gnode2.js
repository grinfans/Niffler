import fs from 'fs'
import {exec, execFile} from 'child_process'

import axios from 'axios'
require('promise.prototype.finally').shim();

import {nodeApiSecretPath} from './config'


let client
const gnodeHost = 'http://localhost:3413'
const jsonRPCUrl = 'http://localhost:3413/v2/owner'
const jsonRPCForeignUrl = 'http://localhost:3413/v2/foreign'

class GnodeService2 {
    static initClient() {
        if(fs.existsSync(nodeApiSecretPath)){
            client = axios.create({
                baseURL: gnodeHost,
                auth: {
                    username: 'grin',
                    password: fs.readFileSync(nodeApiSecretPath).toString()
                },
                timeout: 2500,
            })
        }else{
            client = axios.create({baseURL: gnodeHost, timeout: 2500})
        }
    }

    static jsonRPC(method, params, isForeign){
        const headers = {
            'Content-Type': 'application/json'
        }
        const body = {
            jsonrpc: "2.0",
            id: +new Date(),
            method: method,
            params: params,
        }
        const url = isForeign?jsonRPCForeignUrl:jsonRPCUrl
        return client.post(url, body, headers)
    }

    static getStatus(){
        return GnodeService2.jsonRPC('get_status', [], false)
    }
    
}
GnodeService2.initClient()
export default GnodeService2
