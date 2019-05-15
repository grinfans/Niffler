const messages = {
  msg: {
    title: 'Niffler 钱包',
    password: '密码',
    passwordAgain: '再次输入密码',
    wrongPassword: '密码错误',
    login_: '登录',
    logout: '登出',
    search: '搜索',
    clearup: '清除',
    jump: '跳转',

    confirmed: '已确认',
    unconfirmed: '等待确认',
    locked: '已锁定',
    
    send: '发送',
    receive: '接收',

    cancel:'撤销',
    save: '保存',
    welcome: '欢迎使用Niffler钱包',
    msg: '消息',

    login: {
      walletExist: '发现已有Grin钱包存在；请用原有的密码登陆吧 :-)',
    },
    
    new_:{
      seedPhrase: '助记词',
      toNewMsg: '没有找到已有钱包, 新建一个吧 :)',
      newWallet: '新建钱包',
      backupNote: '重要！请务必备份助记词，用于恢复钱包',
      backupFinish: '备份完成，登录钱包',
      errorPasswdEmpty: '密码不能为空',
      errorPasswdConsistency: '请输入相同的密码',
      errorCreateFailed: '新建钱包时发生错误，你可以试试重启下钱包，过一会儿再试试',
    },

    app:{
      create: '生成交易文件',
      finalize: '确认交易文件并完结交易',
      httpSend: '通过 https/http 发送',
      createRespFile: '生成回应交易文件',
      httpReceive: '开启http端口接收',
      height:'同步高度',
      updateTitle: '发现新版本',
      updateMsg: '发现Niffer钱包的新版本, 请立刻更新! (下载并覆盖原有程序即可).',
      yes: '好的',
      no: '暂时不更新',

      hedwig: '用Hedwig收币'
    },

    info:{
      spendable: '可用余额',
      total: '总计',
    },

    txs:{
      tx: '交易',
      canceled:'已取消',
      noTxFound: '没有找到相关交易',
      noTx:'没有交易',
      cancelSuccess:'取消交易成功',
    },

    commit:{
      unspentCmt: '未花费的交易输出',
      heightCreated: '创建时区块高度',
      unspent: '可用',
      spent: '已用掉',
      noCmtFound: '没有找到相关未花费交易输出',
      noCmt:'没有未花费的交易输出',
    },

    fileSend:{
      sendAmount: '发送数量',
      createTxFile: '生成交易文件',
      WrongAmount: '发送数量错误',
      saveMsg: '保存新生成的交易文件',
      CreateFailed: '生成交易文件错误'
    },

    httpSend:{
      sendAmount: '发送数量',
      address:'发送数量地址',
      WrongAmount: '发送数量错误',
      WrongAddress: '发送地址错误',
      WrongTxData: '交易数据生成失败',
      success: '交易成功',
      TxFailed: '交易失败',
      salteVersion: '交易文件版本',
      salteVersionHelp: '如果发送交易失败，可以试下改变交易文件版本'
    },

    fileReceive: {
      dropMsg: '拖入收到的交易文件',
      saveMsg: '保存新生成的回应交易文件',
      CreateFailed: '生成回应交易文件错误',
      NoSavePlace: '请选择生成交易文件的位置',
      WrongFileType: '交易文件类型错误',
    },
    
    finalize: {
      finalize: '完结交易',
      success: '交易成功',
      ok:'确定',
      sending: '发送中',
      dropMsg: '拖入需要确认的交易文件',
      WrongFileType: '交易文件类型错误',
      TxFailed: '交易失败',
    },

    httpReceive: {
      launchSucess: '启动成功',
      listening: '你的钱包正在监听',
      address: '钱包地址',
      reachableMsg2: '请确保你的ip地址外网用户能够访问',
      close: '关闭HTTP监听',
      attention: '注意',
      reachableMsg: '设置HTTP接收Grin: 需要你有对外的公网ip, 并且你的ip能被访问',
      frp: '如果没有, 可以试试 ngrok 或者 frp的内网穿透方案',
      password: '钱包密码 (用于启动http监听)',
      start: '启动',
      error: '没有输入密码.',
      failed: '启动失败，可能是密码错误',
      failed2: '监听失败，你的对外ip无法被访问到; 请使用交易文件的方法来收发Grin.',
      failed3: '无法获取你的IP地址，请过段时间再试下',
      ip: '你的公网IP'
    },

    hedwig: {
      title: '用Hedwig(v1)收币',
      launchSucess: '启动成功',
      reachable: 'Hedwig临时地址正常可用',
      address: '提币地址',
      tip:'收币时，请保持钱包在线.',
      close: '关闭Hedwig',
      introTitle: '介绍',
      intro1: 'Hedwig(v1) 是一个 为没有公网IP的用户 定制的代理服务，它会提供一个临时的收币地址.',
      intro2: '当有人向这个临时地址发送grin时，它会把这个发币请求转发到你的Niffler钱包，完成交易.',
      start: '启动',
      failed: '连接到hedwig服务器时 发生错误，等下再试吧.',
      failed2: '连接到hedwig临时地址时 发生错误， 重启下钱包 or 等下再试吧.',
      failed3: '启动本地grin接收服务失败， 重启下钱包 or 等下再试吧.',
      copy: '复制地址',
      copied: '地址已经复制到剪贴板'
    }

  }
}
export default messages
