const messages = {
  msg: {
    title: 'Niffler 지갑',
    password: '비밀번호',
    passwordAgain: '암호를 다시 입력하십시오',
    wrongPassword: '비밀번호 오류',
    login_: '로그인',
    logout: '로그 아웃',
    search: '검색',
    clearup: '제거',
    jump: '점프',

    confirmed: '확인 완료',
    unconfirmed: '미확인',
    locked: '잠김',
    
    send: '보내기',
    receive: '수신',

    cancel:'취소',
    save: '저장',

    welcome: 'Niffler 지갑 사용을 환영합니다',
    
    msg: '메시지',

    more: 'More',
    back: 'back',
    
    remote: 'remote',
    local: 'local',

    node: 'Node',
    remoteNode: 'Remote node',
    localNode: 'Local node',

    other: 'Others',
    loading: 'Updating status from Grin node ...',
    error: 'Error',
    login: {
      walletExist: 'grin 지갑이 존재합니다; 원래 비밀번호로 로그인 해 주십시오:-)',
    },
    
    create:{
      seedPhrase: '니모닉',
      toNewMsg: '지갑이 없습니다. 새 것을 만드십시오.',
      newWallet: '새 지갑 만들기',
      backupNote: '지갑을 복구하기 위해 니모닉를 저장해 주십시오',
      backupFinish: 'Ok, I backed up my seed phrase. Close wallet, then open it again',
      errorPasswdEmpty: '비밀번호는 비워 둘 수 없습니다',
      errorPasswdConsistency: '같은 암호를 입력하십시오',
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
      failed: 'Recover wallet from seeds Failed',
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
      create: '트랜잭션 파일 생성',
      finalize: '완료',
      httpSend: 'http/https/Tor 를 통해 전송',
      createRespFile: '응답 트랜잭션 파일 작성',
      httpReceive: '수신 할 http 리스너 열기',
      height:'높이',
      updateTitle: '새 버전을 찾았습니다',
      updateMsg: '새로운 버전의 Niffler 지갑이 존재합니다. 지금 업데이트 해 주시기 바랍니다.',
      yes: '예',
      no: '아니오',
      hedwig: 'Receive via Hedwig',
      tor: 'Tor Network'
    },

    info: {
      spendable: '지출 가능',
      total: '합계',
      unfinalization: 'Unfinalization',
      immature: 'Immature'
    },

    txs:{
      tx: '거래',
      canceled:'취소됨',
      noTxFound: '거래 없음',
      noTx:'거래 없음',
      cancelSuccess:'이 거래가 취소되었습니다',
    },

    commit:{
      unspentCmt: '사용되지 않은 출력 커밋',
      heightCreated: '생성시 블록 높이',
      unspent: '미사용',
      spent: '지출',
      noCmtFound: '사용되지 않은 출력 커밋 없음',
      noCmt:'사용되지 않은 출력 커밋 없음',
    },

    fileSend:{
      sendAmount: '보낼 금액',
      createTxFile: '새 변환 파일 만들기',
      WrongAmount: '잘못된 금액',
      saveMsg: '만든 성적서 파일 저장',
      CreateFail: '새 변환 파일을 만들지 못했습니다'
    },

    httpSend:{
      sendAmount: '보낼 금액',
      address:'주소',
      WrongAmount: '잘못된 금액',
      WrongAddress: '잘못된 주소',
      WrongTxData: '트랜잭션을 만들지 못했습니다',
      success: '탈주 성공',
      TxFailed: '전송 실패 보내기',
    },

    fileReceive: {
      dropMsg: '받은 트랜잭션 파일을 버리십시오',
      WrongFileType: '잘못된 트랜잭션 파일 형식',
      saveMsg: '생성 된 응답 트랜잭션 파일 저장',
      CreateFailed: '새 응답 기록 파일을 만들지 못했습니다',
      NoSavePlace: '저장 위치를 선택하십시오',
    },

    finalize: {
      finalize: '완료',
      success: '거래 성공',
      ok:'확인',
      sending: '보내기',
      dropMsg: '완료 할 응답 트랜잭션 파일 삭제',
      WrongFileType: '잘못된 트랜잭션 파일 형식',
      TxFailed: '변환 실패',
    },

    httpReceive: {
      launchSucess: '시작 성공',
      listening: "지갑의 HTTP 수신 대기",
      address: '지갑 주소',
      reachableMsg2: '인터넷 사용자가 귀하의 IP에 연결할 수 있는지 확인하십시오',
      close: '지갑의 HTTP 수신 정지',
      attention: '주의',
      reachableMsg: 'HTTP 연결을 시작하기 위해 인터넷 사용자들에게 도달할 수 있는 공용 ip가 필요합니다',
      password: '지갑 비밀번호 (HTTP 수신 대기)',
      start: '시작',
      failed: '시작 실패, 비밀번호를 확인 해 주십시오',
      failed2: 'HTTP listen failed, your public ip could not reachable by internet user. Try trascation file Or Hedwig.',
      failed3: 'Failed to get your public ip; try it later',
      failed4: 'Localhost http listen is running(http://127.0.0.1:3415). Howerver, your public ip could not reachable by internet user. Try trascation file Or Hedwig.',
      ip: '귀하의 공개 IP'
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

    remove:{
      title: 'Remove Current Wallet',
      warning: 'Warning !',
      info: 'Before you remove current wallet, Make sure there is no grin in this wallet or You write down the Seed Phrase !',
      help: 'Enter "remove" into the input box below to confirm',
      remove: 'Remove',
      success: 'Current wallet was removed. Click "OK" to restart Niffler.'
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
      errorInvalidProxy: 'Invalid proxy',
      saved: 'Setting saved. will use this setting when start Tor next time.s'
    },

  }
}
export default messages
