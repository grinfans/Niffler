
let keyPostedUnconfirmed = 'posted_unconfirmed_txs'
let keyLocalGnodeStatus = 'local_gnode_status'
let keyGnodeLocation = 'local_gnode_location'
let keySpendable = 'spendable'
let keyLocalGnodeCheckable = 'local_gnode_checkable'
let keyTorRunning = 'tor_running'

class DBService{
    static getPostedUnconfirmedTxs(){
        let txs = localStorage.getItem(keyPostedUnconfirmed)
        if(txs === null){
            return new Set()
        }
        return new Set(JSON.parse(txs))
    }
    static setPostedUnconfirmedTxs(txs){
        if(txs === null){
            localStorage.removeItem(keyPostedUnconfirmed)
        }else{
            let txs_ = [...txs]
            localStorage.setItem(keyPostedUnconfirmed, JSON.stringify(txs_))
        }
    }
    static addPostedUnconfirmedTx(tx_id){
        let txs = DBService.getPostedUnconfirmedTxs()
        txs.add(tx_id)
        DBService.setPostedUnconfirmedTxs(txs)
    }
    static deletePostedUnconfirmedTx(tx_id){
        let txs = DBService.getPostedUnconfirmedTxs()
        txs.delete(tx_id)
        DBService.setPostedUnconfirmedTxs(txs)
    }

    static getSpendable(){
        let amount = localStorage.getItem(keySpendable)
        if(amount){
            return parseFloat(amount)
        }
    }
    static setSpendable(amount){
        return localStorage.setItem(keySpendable, amount)
    }

    static setLocalGnodeStatus(status){
        return localStorage.setItem(keyLocalGnodeStatus, status)
    }

    static getLocalGnodeStatus(){
        return localStorage.getItem(keyLocalGnodeStatus)
    }

    static setGnodeLocation(location){
        return localStorage.setItem(keyGnodeLocation, location)
    }

    static getGnodeLocation(){
        return localStorage.getItem(keyGnodeLocation)
    }

    static setLocalGnodeCheckable(checkable){
        return localStorage.setItem(keyLocalGnodeCheckable, JSON.stringify(checkable))
    }

    static getLocalGnodeCheckable(){
        return JSON.parse(localStorage.getItem(keyLocalGnodeCheckable))
    }

    static setTorRunning(running){
        return localStorage.setItem(keyTorRunning, running)
    }

    static getTorRunning(){
        return localStorage.getItem(keyTorRunning)
    }

}

export default DBService