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

    login: {
      walletExist: 'grin 지갑이 존재합니다; 원래 비밀번호로 로그인 해 주십시오:-)',
    },
    
    new_:{
      seedPhrase: '니모닉',
      toNewMsg: '지갑이 없습니다. 새 것을 만드십시오.',
      newWallet: '새 지갑 만들기',
      backupNote: '지갑을 복구하기 위해 니모닉를 저장해 주십시오',
      backupFinish: '니모닉를 저장하였습니다. 지갑에 로그인 해 주십시오',
      errorPasswdEmpty: '비밀번호는 비워 둘 수 없습니다',
      errorPasswdConsistency: '같은 암호를 입력하십시오'
    },
    
    app:{
      create: '트랜잭션 파일 생성',
      finalize: '완료',
      httpSend: 'http / https를 통해 전송',
      createRespFile: '응답 트랜잭션 파일 작성',
      httpReceive: '수신 할 http 리스너 열기',
      height:'높이',
      updateTitle: '새 버전을 찾았습니다',
      updateMsg: '새로운 버전의 Niffler 지갑이 존재합니다. 지금 업데이트 해 주시기 바랍니다.',
      yes: '예',
      no: '아니오'
    },

    info: {
      spendable: '지출 가능',
      total: '합계',
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
      frp: '공용 ip가 없다면 ngrok 혹은 frp를 시도하십시오',
      password: '지갑 비밀번호 (HTTP 수신 대기)',
      start: '시작',
      failed: '시작 실패, 비밀번호를 확인 해 주십시오',
      ip: '귀하의 공개 IP'
    },


  }
}
export default messages
