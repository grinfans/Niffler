const messages = {
  msg: {
    title: 'Niffler Wallet',
    password: 'Password',
    passwordAgain: 'Enter password again',
    wrongPassword: 'Grin owner Api process failed to start, the password may be wrong',
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

    cancel: 'Cancel',
    save: 'Save',
    welcome: 'Welcome to Niffler Wallet',
    msg: 'Message',
    more: 'More',
    back: 'Back',

    remote: 'remote',
    local: 'local',

    node: 'Node',
    remoteNode: 'Remote node',
    localNode: 'Local node',

    other: 'Other',

    loading: 'Updating status from Grin node...',
    error: 'Error',
    optional: 'Optional',
    open: 'Open',
    close: 'Close',

    address: 'Slatepack address',

    login: {
      walletExist: 'Found existing Grin wallet data; please login with the original password :-)',
      waitForLocalGnode: 'Waiting for the local Grin node to start',
      selectingGnode: 'Selecting Grin node',
      gnode: 'Grin node'
    },

    remove:{
      title: 'Remove Current Wallet',
      warning: 'Warning !',
      info: 'Before removing the wallet, make sure that there is no Grin in this wallet or you have fully recorded the recovery phrase!',
      help: 'Enter "remove" into the input box below to confirm',
      remove: 'Remove',
      success: 'The current wallet has been removed, please restart Niffler.'
    },

    new_:{
      create: 'New wallet',
      restore: 'Restore wallet through recovery phrase',
      import: 'Import wallet backup file'
    },

    create:{
      toNewMsg: 'No wallet has been found. Let\'s create a new one :-).',
      seedPhrase: 'Recovery Phrase',
      newWallet: 'New wallet',
      backupNote: 'Important! Be sure to backup your recovery phrase to restore your wallet later',
      backupFinish: 'The backup is complete. Close the wallet, then reopen it and sign in.',
      errorPasswdEmpty: 'Password cannot be empty',
      errorPasswdConsistency: 'Please enter the same password',
      errorCreateFailed: 'An error occurred while creating the new wallet. Try restarting the wallet or try again later.',
    },

    restore:{
      seedPhrase: 'Recovery Phrase',
      title: 'Restore the wallet from the recovery phrase',
      addSeedsInfo: 'Please enter the words of the recovery phrase one by one',
      add: 'Add',
      invalid: 'Invalid Recovery Phrase',
      failed: 'Failed to restore wallet from recovery phrase',
      delete: 'Delete',
      added: 'Recovery phrase words entry completed',
      newPassword: 'Set a new password',
      recover: 'Recover',
      reAdd: 'Enter the recovery phrase again',
      recovered: 'The wallet has been successfully restored, starting to sync the wallet balance from the Grin blockchain.',
      restoring: 'It should take between 10 and 30 minutes. Please do not close the wallet during the transaction. Please wait...',
      restored: 'The wallet has been restored successfully and the balance sync is complete',
      login: 'Close the wallet, then reopen it and sign in.',
    },

    app:{
      create: 'Create Slatepack',
      finalize: 'Finalize',
      httpSend: 'Send via http/https',
      createRespFile: 'Create response Slatepack',
      httpReceive: 'Open http reception port',
      height: 'Height',
      updateTitle: 'A new version has been found',
      updateMsg: 'A new version of Niffler Wallet has been found. Please update Right Now! (Download it and overwrite the original program).',
      yes: 'Proceed to update',
      no: 'Do not update temporarily',

      hedwig: 'Receive via Hedwig',
      tor: 'Tor Network',
      address: 'Slatepack address',
    },

    info:{
      spendable: 'Spendable',
      total: 'Total',
      unfinalization: 'Unfinalized',
      immature: 'Immature'
    },

    txs:{
      tx: 'Transactions',
      canceled: 'Canceled',
      noTxFound: 'No transactions Found',
      noTx: 'No transactions',
      cancelSuccess: 'Transaction successfully canceled',
    },

    commit:{
      unspentCmt: 'Unspent Output Commit',
      heightCreated: 'Block height when Created',
      unspent: 'Unspent',
      spent: 'Spent',
      noCmtFound: 'No Unspent Output Commit Found',
      noCmt: 'No Unspent Output Commit',
      copied: 'Copied'
    },

    fileSend:{
      sendAmount: 'Amount to send',
      createTxFile: 'Create Slatepack',
      WrongAmount: 'Wrong amount',
      WrongSlatepackAddress: 'Wrong Slatepack address',
      saveMsg: 'Save Slatepack as file',
      CreateFailed: 'Failed to create new Slatepack',
      NotEnough: 'Not enough balance, please leave at least 0.01 for handling fee.',

      slatepack: 'SLATEPACK',
      slatepackAddress: 'Slatepack Address of recipient',
      slatepackAddressTips: 'Slatepack address is used to encrypt transaction and create payment proof.',
      slatepackCreated: 'Slatepack is created !',

      slatepackEncryptedTips: 'This Slatepack is encrypted. It is safe to transfer in any channels.',
      slatepackUnEncryptedTips: 'This Slatepack is not encrypted, please send it over secure channels.',
      copySlatepack: 'Copy',
      fileSlatepack: 'Save Slatepack as file',
      copied: 'Copied'
    },

    httpSend:{
      sendAmount: 'Amount to send',
      sendMessage: 'Message',
      optional: 'optional',
      address:'Sending address',
      WrongAmount: 'Wrong amount',
      NotEnough: 'Not enough balance, please leave at least 0.01 for handling fee.',
      WrongAddress: 'Wrong sending address',
      WrongTxData: 'Failed to build transaction',
      success: 'Successful transaction',
      TxFailed: 'Failed to send transaction',
      TxResponseFailed: 'The recipient did not respond correctly',
      TxCreateFailed: 'Failed to create transaction',
      salteVersion: 'Slate file version',
      salteVersionHelp: 'If you failed to send Grin, try to change the Slate file version then resend',
      noTor: 'The Tor network is not started, you must start it first.',   
    },

    fileReceive: {
      dropMsg: 'Drop the received transaction file',
      saveMsg: 'Save the newly created Slatepack response',
      CreateFailed: 'Failed to create Slatepack response',
      NoSavePlace: 'Please choose the save location',
      WrongFileType: 'Wrong transaction file type',
      toOpen: 'Open Slatepack file',
      toPaste: 'or copy Slatepack, then paste it into the inputbox below',
      create: 'Create Slatepack response',
      WrongSlatepack: 'Wrong Slatepack content',
      openMsg: 'Open Slatepack file',
      sender: 'Sender',
      slatepackCreated: 'Response Slatepack is created!',
      copySlatepack: 'Copy',
      fileSlatepack: 'Save as file',
      copied: 'Copied',
    },

    finalize: {
      finalize: 'Finalize',
      success: 'Successful transaction',
      ok: 'OK',
      sending: 'Sending',
      dropMsg: 'Drop response transaction file to finalize',
      WrongFileType: 'Wrong transaction file type',
      WrongSlatepack: 'Wrong Slatepack content',
      TxFailed: 'Transaction failed',
      toPaste: 'or copy Slatepack, and paste it into the inputbox below',
      toOpen: 'Open Slatepack file',
      send: 'Finalize and post transaction',
      openMsg: 'Open Slatepack file'
    },

    httpReceive: {
      launchSucess: 'Started successfully',
      listening: "Wallet's HTTP port is listening",
      address: 'Wallet Address',
      reachableMsg2: 'Please make sure your IP address is reachable to external users',
      close: 'Stop HTTP listening',
      attention: 'Attention',
      reachableMsg: 'To start HTTP listening, you should have a public IP address, reachable from the Internet.',
      password: 'Wallet Password (used to start HTTP listening)',
      start: 'Start',
      error: 'No password entered.',
      failed: 'Failed to start, the password may be wrong',
      failed2: 'HTTP listening failed, your public IP address is not reachable from the Internet. Please use transaction files or the Hedwig method to send and receive Grin.',
      failed3: 'Unable to obtain your IP address, please try again later',
      failed4: 'Local HTTP listening is running (http://127.0.0.1:3415). However, your public IP address cannot be reached from the Internet. Try the transaction file Or Hedwig method.',
      ip: 'Your public IP'
    },

    hedwig: {
      title: 'Receive via Hedwig(v1)',
      launchSucess: 'Started successfully',
      reachable: 'Hedwig temporary address is available',
      address: 'Receiving address',
      tip: 'Please keep wallet online during Grin reception.',
      close: 'Stop Hedwig',
      introTitle: 'Introduction',
      intro1: 'Hedwig(v1) is a relay service for users without a public IP address. It provides a temporary address to receive Grin.',
      intro2: 'When someone sends Grin to this address, Hedwig(v1) forwards the request to your Niffler wallet to complete the transaction.',
      start: 'Start',
      failed: 'An error occurred while connecting to the Hedwig server. Please try again later.',
      failed2: 'An error occurred while connecting to the Hedwig address. Please restart the wallet or try again later.',
      failed3: 'Local Grin Receiver Service failed to start. Please restart the wallet or try again later.',
      copy: 'copy address',
      copied: 'Address has been copied to clipboard'
    },

    check: {
      title: 'Check Balance',
      checking: 'Checking, please wait...',
      stop: 'Stop Checking',


      tip: 'Checking may take 10 to 30 minutes',
      introTitle: 'Introduction',

      intro1: 'When your local wallet balance is inconsistent with the balance on the Grin blockchain (maybe due to the cancellation of the transaction or sending failure, etc.), you can use the "Check Balance" function.',
      intro2: 'During the check, among all the unspent outputs (UTXO) of the Grin blockchain, find the unspent outputs you can use and add them to get your balance.',
      
      start: 'Start',
      stopCheckMsg: 'Check has been cancelled',
      checkedMsg: 'Check completed'
    },

    lang: {
      title: 'Select Language',
      lang: 'Language',
      select: 'Select'
    },

    gnode:{
      title: 'Local Grin node',
      tabStatus: 'Status',
      tabPeers: 'Peers',
      tabLog: 'Log',
      tabConfig: 'Settings',
      statusRunning: 'Running, available',
      statusSyncing: 'Syncing...',
      statusToStart: 'Not started',
      status: 'Status',
      localRemoteHeight: 'Local Height/Networking Height',
      nodeVersion: 'Node Version',
      protocolVersion: 'Protocol Version',
      connectedCount: 'Connected Peers',
      location: 'Block data storage location',
      size: 'Full node block data size',
      restart: 'Restart the local node',
      height: 'Height',
      remove: 'Remove current block data and sync from scratch',
      removeConfirm: 'Are you sure to Remove the current Grin block data?'
    },

    gnodeConfig:{
      warning: 'For ordinary use, use the recommended settings!',
      useLocalorNot: '(Recommend) Use local Grin node',
      connectMethod: 'Node connection method',
      remoteFirst: 'Use the remote Grin node first. When the remote node is not available, use the local node.',
      localFirst:  '(Recommend) When the local node is synced, the local connection is used first, then the remote connection if necessary.',
      remoteAllTime: 'Always connect to the remote node',
      localAllTime: 'Always connect to the local node',
      background: '(Recommend) Keep running the Grin node in background when Niffler is closed.',
      restoreToDefault: 'Restore default settings',
      saved: 'The settings have been saved and will take effect after restarting the wallet.'
    },

    gnodeConfigModal:{
      config: 'Grin Local Node Settings',
      title: 'Grin node settings'
    },

    tor:{
      title: 'Tor',
      tabStatus: 'Status',
      tabLog: 'Log',
      tabConfig: 'Settings',
      statusRunning: 'Tor Running',
      statusFailed: 'Tor Starting Failed',
      statusStarting: 'Tor Starting',
      statusToStart: 'Not Running',
      status: 'Status',
      start: 'start',
      restart: 'Restart',
      address: 'Tor address to receive Grin',
      
      tip: 'Please keep wallet online during Grin reception',
      tip2: 'Starting... it may take 30-60 seconds',
      introTitle: 'Introduction',
      intro1: 'Tor is a free and open-source software for enabling anonymous communication.',
      intro2: 'Receiving/sending Grin via Tor is anonymous, secure and decentralized',
      intro3: '(If Tor is banned on your network, first configure an HTTPS/SOCKS5 proxy.)',

      copy: 'Copy Address',
      copied: 'Address copied to clipboard',
      startWhenLaunch: '(Recommend) Auto start Tor on wallet opening',
      proxy: 'proxy',
      proxyUser: 'username',
      proxyPassword: 'password',
      proxyHelp: 'Connect Tor network via proxy',
      optional: 'Optional',
      proxyHelp2: 'Proxy example: https://127.0.0.1:9009 or socks5://127.0.0.1:1080',

      error: 'Failed to start the Tor network.',
      errorNoCurl: 'The curl command was not found, please install cURL first.',
      errorNoTor: 'Tor was not found, please install Tor first.',
      errorInvalidProxy: 'Invalid proxy',
      saved: 'The settings have been saved and will take effect the next time the Tor network is started.'
    },

    gaddress:{
      address: 'Your Slatepack address',
      copied: 'Copied',
      copy: 'Copy Slatepack address',
      tips: 'Slatepack address is used to encrypt transaction and create payment proof. It is not stored on the Grin blockchain.'
    },

    log: {
      title: 'Export Log',
      saveMsg: "Export today's Niffler wallet log.",
    }

  }
}
export default messages
