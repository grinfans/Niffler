import axios from 'axios'
import {releaseUrl, version} from './config'
import log from './logger'

const checkUpdate = async () => {
  try{
    const res = await axios.get(releaseUrl)
    if (res.status === 200) {
      const latest = res.data.name
      log.debug(`checkUpdate last version is: ${latest}`)
      const result = compareVersion2Update(version, latest)
      log.debug(`Update need? ${result}`)
      return result
    }else{
      log.error(`checkUpdate resp error: ${res.status} (${res.data})`)
      return false
    }
  }catch(error){
    log.error(`checkUpdate failed: ${error}`)
    return false
  }
}

// if true -> update else return false
const compareVersion2Update = (current, latest) => {
  const currentVersion = current.split('.').map(item => parseInt(item))
  const latestVersion = latest.split('.').map(item => parseInt(item))

  for (let i = 0; i < 3; i++) {
    if (currentVersion[i] < latestVersion[i]) {
      return true
    }
    if (currentVersion[i] > latestVersion[i]) {
      return false
    }
  }
  return false
}

export default checkUpdate
