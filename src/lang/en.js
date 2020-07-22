const messages = {
  msg: {
    title: 'Niffler Wallet',
    password: 'Password',
    passwordAgain: 'Enter password again',
    wrongPassword: 'Failed to start Grin owner api. May be Wrong password',
    login_: 'Login',
    logout: 'Logout',
    search: 'Search',
    clearup: 'Clearup',
    jump: 'Jump',

    confirmed: 'Confirmed',
    unconfirmed: 'Unconfirmed',
    locked: 'Locked',
    
    send: 'Send',
    receive: 'Receive',

    cancel:'Cancel',
    save: 'Save',

    welcome: 'Welcome to use Niffler wallet',
    back: 'Back',
    msg: 'Message',
    more: 'More',

    remote: 'remote',
    local: 'local',

    node: 'Node',
    remoteNode: 'Remote node',
    localNode: 'Local node',

    other: 'Others',

    loading: 'Updating status from Grin node ...',
    
    waitForLocalGnode: 'Wait for local grin node to start',

    error: 'Error',
   
    optional: 'Optional',
    open: 'Open',
    close: 'Close',

    address: 'Slatepack address',

    login: {
      walletExist: 'Found grin wallet data exists; login with original password :-)',
    },

    remove:{
      title: 'Remove Current Wallet',
      warning: 'Warning !',
      info: 'Before you remove current wallet, Make sure there is no grin in this wallet or You write down the Seed Phrase !',
      help: 'Enter "remove" into the input box below to confirm',
      remove: 'Remove',
      success: 'Current wallet was removed. Click "OK" to restart Niffler.'
    },
    
    create:{
      seedPhrase: 'Seed Phrase',
      toNewMsg: 'No wallet exists Found. Create a New One.',
      newWallet: 'Create new wallet',
      backupNote: 'Import！Please backup your seed phrase to restore your wallet',
      backupFinish: 'Ok, I backed up my seed phrase. Close wallet, then open it again',
      errorPasswdEmpty: 'Password cannot be empty',
      errorPasswdConsistency: 'Please enter the same password',
      errorCreateFailed: 'Error when try to create new wallet. Maybe restart wallet and Try it later.',
    },

    new_:{
      create: 'Create new wallet',
      restore: 'Restore wallet via seed phrase',
      import: 'Import wallet backup file'
    },
    
    restore:{
      seedPhrase: 'Seed Phrase',
      title: 'Restore wallet via seed phrase',
      addSeedsInfo: 'Add seed phrase one by one please',
      add: 'Add',
      invalid: 'Invalid Seed Phrase',
      failed: 'Recover wallet from seeds failed',
      delete: 'Delete',
      added: 'Finish enter seed phrase',
      newPassword: 'Set a new password',
      recover: 'Recover',
      reAdd: 'Re-enter seed phrase ',
      recovered: 'Wallet recovered, it is time to check balance from Grin blockchain',
      restoring: 'It will take 10-30 minutes to finish check. Be patient ......',
      restored: 'Wallet recovered and balance checked.',
      login: 'Close Wallet, then Open it again to Login',
    },

    app:{
      create: 'Create slatepack',
      finalize: 'Finalize',
      httpSend: 'Send via http/https',
      createRespFile: 'Create response slatepack',
      httpReceive: 'Open http listener to receive',
      height:'Height',
      updateTitle: 'Found new version',
      updateMsg: 'Found new version of Niffler wallet. Please update Right NOW.',
      yes: 'yes',
      no: 'no',
      hedwig: 'Receive via Hedwig',
      tor: 'Tor Network'
    },

    info: {
      spendable: 'Spendable',
      total: 'Total',
      unfinalization: 'Unfinalized',
      immature: 'Immature'
    },

    txs:{
      tx: 'Transactions',
      canceled:'Canceled',
      noTxFound: 'No transactions Found',
      noTx:'No transactions',
      cancelSuccess:'This transaction canceled',
    },

    commit:{
      unspentCmt: 'Unspent Output Commit',
      heightCreated: 'Block height when Created',
      unspent: 'Unspent',
      spent: 'Spent',
      noCmtFound: 'No Unspent Output Commit Found',
      noCmt:'No Unspent Output Commit',
      copied: 'Copied'
    },

    fileSend:{
      sendAmount: 'Amount to send',
      createTxFile: 'Create slatepack',
      WrongAmount: 'Wrong amount',
      saveMsg: 'Save slatepack as file',
      CreateFailed: 'Failed to create new slatepack',
      NotEnough: 'Not enough amount. Keep 0.01 as fee',

      slatepack: 'SLATEPACK',
      slatepackAddress: 'Slatepack Address to send',
      slatepackAddressTips: 'Slatepack address is used to encrypt transaction and create payment proof.',
      slatepackCreated: 'Slatepack is created !',

      slatepackEncryptedTips: 'This slatepack is encrypted.',
      slatepackUnEncryptedTips: 'This slatepack is unencrypted, please send over security channels.',
      copySlatepack: 'Copy',
      fileSlatepack: 'Save slatepack as file',
      copied: 'Copied'
    },

    httpSend:{
      sendAmount: 'Amount to send',
      sendMessage: 'Message',
      optional: 'optional',
      address:'Address',
      WrongAmount: 'Wrong amount',
      NotEnough: 'Not enough amount. Keep 0.01 as fee',
      WrongAddress: 'Wrong address',
      WrongTxData: 'Failed to build transaction',
      success: 'transaction success',
      TxFailed: 'Send transaction failed',
      TxResponseFailed: 'Failed to get right respose from receiver',
      TxCreateFailed: 'Create transaction failed',
      salteVersion: 'Slate file version',
      salteVersionHelp: 'If you failed to send grin, try change the Slate file version then resend',
      noTor: 'Lauch Tor first.',   
    },

    fileReceive: {
      dropMsg: 'Drop transaction file received',
      WrongFileType: 'Wrong transaction file type',
      saveMsg: 'Save the new response slatpack',
      CreateFailed: 'Failed to create response slatpack',
      NoSavePlace: 'Please choose the location to save',

     
      toOpen: 'Open slatepack file',
      toPaste: 'or copy slatepack, and paste it into the inputbox below',
      create: 'Create response slatepack',
      WrongSlatepack: 'Wrong Slatepack',
      openMsg: 'Open slatepack file',
      sender: 'Sender',
      slatepackCreated: 'Response slatepack is created!',
      copySlatepack: 'Copy',
      fileSlatepack: 'Save as file',
      copied: 'Copied',
    },

    finalize: {
      finalize: 'Finalize',
      success: 'transaction success',
      ok:'OK',
      sending: 'Sending',
      dropMsg: 'Drop response transaction file to finalize',
      WrongFileType: 'Wrong transaction file type',
      TxFailed: 'transaction failed',

     
      WrongSlatepack: 'Wrong Slatepack',
      toOpen: 'Open slatepack file',
      toPaste: 'or copy slatepack, and paste it into the inputbox below',
      send: 'Finalize and post transcation',
      openMsg: 'Open slatepack file'
    },

    httpReceive: {
      launchSucess: 'Started successful',
      listening: "Wallet's HTTP listen is running",
      address: 'Wallet Address',
      reachableMsg2: 'Make sure your ip is reachable by internet user',
      close: 'Stop listen',
      attention: 'Attention',
      reachableMsg: 'To start HTTP listen, you should have public ip, which is reachable by internet user.',
      password: 'Wallet Password (used to start HTTP listen)',
      start: 'Start',
      error: 'No password.',
      failed: 'Start Failed, Maybe wrong password',
      failed2: 'HTTP listen failed, your public ip could not reachable by internet user. Try trascation file Or Hedwig.',
      failed3: 'Failed to get your public ip; try it later',
      failed4: 'Localhost http listen is running(http://127.0.0.1:3415). However, your public ip could not reachable by internet user. Try trascation file Or Hedwig.',
      ip: 'your public ip'
    },

    hedwig: {
      title: 'Receive via Hedwig(v1)',
      launchSucess: 'Started successful',
      reachable: 'Hedwig address is available',
      address: 'Address to receive',
      tip:'Please keep wallet online.',
      close: 'Stop Hedwig',
      introTitle: 'Introduction',
      intro1: 'Hedwig(v1) is a relay service for users without a public ip. It provides a temporary address to receive grin.',
      intro2: 'When someone send grin to the address, Hedwig(v1) will forward the send request to your wallet. So you will get your grin.',
      start: 'Start',
      failed: 'Error when try to connect Hedwig server, try it latter maybe',
      failed2: 'Error when test Hedwig address, try it later maybe or restart wallet.',
      failed3: 'Failed to start local grin receive service, try it later maybe or restart wallet.',
      copy: 'copy address',
      copied: 'address was copied in clipboard'
    },

    check: {
      title: 'Check Balance',
      checking: 'Checking, be patient ...',
      stop: 'Stop Check',

      tip:'It will take 10-30 minutes to finish check',
      introTitle: 'Introduction',

      intro1: 'Because of all of the possibilities listed in the cancel command, as well as the possibility of forks, it is quite possible for your wallet to end up in an inconsistent state',
      intro2: "For this reason, Grin provides a manual check command that scans the chain's UTXO set for any outputs belonging to your wallet, and ensures they're in a consistent state with your local wallet database.",
      
      start: 'Start',
      stopCheckMsg: 'Check was cancelled',
      checkedMsg: 'Check balance finished'
    },

    lang: {
      title: 'Select Language',
      lang: 'Language',
      select: 'Select'
    },

    gnode:{
      title: 'Local grin node',
      tabStatus: 'Status',
      tabPeers: 'Peers',
      tabLog: 'Log',
      tabConfig: 'Settings',
      statusRunning: 'Running, Available',
      statusSyncing: 'Syncing ...',
      statusToStart: 'not Running',
      status:'Status',
      localRemoteHeight: 'Local Height/Networking Height',
      nodeVersion: 'Node Version',
      protocolVersion: 'Protocol Version',
      connectedCount: 'Connected Peers',
      location: 'Location where grin blockchain data store',
      size: 'Size of grin blockchain data',
      restart: 'Restart grin node',
      height: 'height'
    },

    gnodeConfig:{
      warning: 'For General users, default setting is preferred!',
      useLocalorNot: '(Recommend)Use local grin node',
      connectMethod: 'Connect Method',
      remoteFirst: 'Remote grin node is preferred, When remote node is not available, use local node.',
      localFirst:  '(Recommend)Local grin node is preferred when it is synced. Otherwise, use remote node.',
      remoteAllTime: 'Use remote all the time',
      localAllTime: 'Use local all the time',
      background: '(Recommend)Running grin node background when Niffler is closed.',
      restoreToDefault: 'Restore to default setting',
      saved: 'Settings was saved, Restart Niffler to take effect.'
    },

    gnodeConfigModal:{
      config: 'Grin Local Node Settings',
      title: 'Grin node settings'
    },

    tor:{
      title: 'Tor',
      tabStatus: 'Status',
      tabLog: 'Log',
      tabConfig: 'Setting',
      statusRunning: 'Tor Running',
      statusFailed: 'Tor Start Failed',
      statusStarting: 'Tor Starting',
      statusToStart: 'Not Running',
      status:'Status',
      start: 'start',
      restart: 'restart',
      address: 'Tor address to receive grin',
      
      tip: 'Please keep wallet online When receving grin',
      tip2: 'Starting ... it may take 10-60 seconds',
      introTitle: 'Introduction',
      intro1: 'Tor is free and open-source software for enabling anonymous communication.',
      intro2: 'Receive/send grin via tor is more anonymous/sercurity/decentralized',
      intro3: '(If Tor is blocked by network in your location, Configure a https/socks proxy first.)',

      start: 'start',
      copy: 'Copy Address',
      copied: 'copied',
      startWhenLaunch: '(Recommend) Auto start Tor after open wallet',
      proxy: 'proxy',
      proxyUser: 'user',
      proxyPassword: 'password',
      proxyHelp: 'Connect Tor network via proxy',
      optional: 'optional',
      proxyHelp2: 'Proxy example: https://127.0.0.1:9009 or socks5://127.0.0.1:1080',

      error: 'Start Tor network failed.',
      errorNoCurl: 'No curl found. Install curl first.',
      errorNoTor: 'No tor found. Install tor first.',
      errorInvalidProxy: 'Invalid proxy',
      saved: 'Setting saved. will use this setting when start Tor next time.'
    },

    gaddress:{
      address: 'Your slatepack address.',
      copied: 'Copied',
      copy: 'Copy slatepack address', 
      tips: 'Slatepack address is used to encrypt transaction and create payment proof. It will not be stored on the grin blockchain.'
    }
  }
}
export default messages
