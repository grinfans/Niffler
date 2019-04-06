var fs = require('fs');
import { nifflerPath, logDir, getConfig, setConfig, updateConfig} from './config';

export function checkFirstTime(){
    console.log(nifflerPath)
    const isFirstTime = fs.existsSync(nifflerPath)?false:true
    if(isFirstTime){
        fs.mkdirSync(nifflerPath)
        fs.mkdirSync(logDir)
        setConfig({'firstTime':true})
    }
    else{
        updateConfig({'firstTime':false})
    }
}

export function isFirstTime(){
    return getConfig()['firstTime']
}

