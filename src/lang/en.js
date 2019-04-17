const messages = {
  msg: {
    title: 'Niffler Wallet',
    password: 'Password',
    passwordAgain: 'Enter password again',
    wrongPassword: 'Wrong password',
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
    
    msg: 'Message',

    login: {
      walletExist: 'Found grin wallet data exists; login with original password :-)',
    },
    
    new_:{
      seedPhrase: 'Seed Phrase',
      toNewMsg: 'No wallet exists Found. Create a New One.',
      newWallet: 'Create new wallet',
      backupNote: 'Import！Please backup your seed phrase to restore your wallet',
      backupFinish: 'Ok, I backed up my seed phrase. Login my wallet',
      errorPasswdEmpty: 'Password cannot be empty',
      errorPasswdConsistency: 'Please enter the same password'
    },
    
    app:{
      create: 'Create transaction file',
      finalize: 'Finalize',
      httpSend: 'Send via http/https',
      createRespFile: 'Create response transaction file',
      httpReceive: 'Open http listener to receive',
      height:'Height',
      updateTitle: 'Found new version',
      updateMsg: 'Found new version of Niffler wallet. Please update Right NOW.',
      yes: 'yes',
      no: 'no'
    },

    info: {
      spendable: 'Spendable',
      total: 'Total',
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
    },

    fileSend:{
      sendAmount: 'Amount to send',
      createTxFile: 'Create new transcation file',
      WrongAmount: 'Wrong amount',
      saveMsg: 'Save transcation file created',
      CreateFail: 'Failed to create new transcation file'
    },

    httpSend:{
      sendAmount: 'Amount to send',
      address:'Address',
      WrongAmount: 'Wrong amount',
      WrongAddress: 'Wrong address',
      WrongTxData: 'Failed to build transaction',
      success: 'Transcation success',
      TxFailed: 'Send transcation failed',
    },

    fileReceive: {
      dropMsg: 'Drop transaction file received',
      WrongFileType: 'Wrong transaction file type',
      saveMsg: 'Save response transaction file created',
      CreateFailed: 'Failed to create new response transcation file',
      NoSavePlace: 'Please choose the location to save',
    },

    finalize: {
      finalize: 'Finalize',
      success: 'Transcation success',
      ok:'OK',
      sending: 'Sending',
      dropMsg: 'Drop response transaction file to finalize',
      WrongFileType: 'Wrong transaction file type',
      TxFailed: 'transcation failed',
    },

    httpReceive: {
      launchSucess: 'Started successful',
      listening: "Wallet's HTTP listen is running",
      address: 'Wallet Address',
      reachableMsg2: 'Make sure your ip is reachable by internet user',
      close: 'Stop listen',
      attention: 'Attention',
      reachableMsg: 'To start HTTP listen, you should have public ip, which is reachable by internet user.',
      frp: 'If you don not have public ip, try ngrok or frp',
      password: 'Wallet Password (used to start HTTP listen)',
      start: 'Start',
      failed: 'Start Failed, Maybe wrong password',
      failed2: 'HTTP listen failed, your public ip could not reachable by internet user. Try trascation file way.',
      failed3: 'Failed to get your public ip; try it later',
      ip: 'your public ip'
    },


  }
}
export default messages
