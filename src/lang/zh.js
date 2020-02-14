const messages = {
  msg: {
    title: 'Niffler 钱包',
    password: '密码',
    passwordAgain: '再次输入密码',
    wrongPassword: 'Grin owner Api进程启动失败，可能是密码错误',
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
    more: '更多',
    back: '返回',
    
    remote: '远程',
    local: '本地',

    node: '节点',
    remoteNode: '远程节点',
    localNode: '本地节点',

    other: '其他',

    loading: '从Grin节点更新状态中 ...',

    error: '错误',

    login: {
      walletExist: '发现已有Grin钱包存在；请用原有的密码登陆吧 :-)',
    },

    remove:{
      title: '移除当前钱包',
      warning: '警告 !',
      info: '移除钱包前，请确认 当前钱包里已经没有grin 或者 你已经完整记录了当前钱包的助记词 !',
      help: '在下面输入框填入 “移除” 用于确认',
      remove: '移除钱包',
      success: '当前钱包已经移除，请重启Niffler'
    },

    new_:{
      create: '新建钱包',
      restore: '通过助记词导入钱包',
      import: '通过钱包备份文件导入'
    },

    create:{
      toNewMsg: '没有发现已经建好的钱包；新建一个吧 :-)',
      seedPhrase: '助记词',
      newWallet: '新建钱包',
      backupNote: '重要！请务必备份助记词，用于恢复钱包',
      backupFinish: '备份完成，关闭钱包；请再次打开钱包，并登录。',
      errorPasswdEmpty: '密码不能为空',
      errorPasswdConsistency: '请输入相同的密码',
      errorCreateFailed: '新建钱包时发生错误，你可以试试重启下钱包，过一会儿再试试',
    },

    restore:{
      seedPhrase: '助记词',
      title: '从助记词中恢复钱包',
      addSeedsInfo: '请一个个地输入助记词',
      add: '添加',
      invalid: '助记词无效',
      failed: '从助记词中恢复钱包失败',
      delete: '删除',
      added: '助记词输入完成',
      newPassword: '设置新的密码',
      recover: '恢复钱包',
      reAdd: '重新输入',
      recovered: '钱包恢复成功, 开始从Grin区块链同步钱包余额；',
      restoring: '预计需要15-30分钟，不要关闭钱包，请耐心等待 ......',
      restored: '钱包恢复成功并且余额同步完成',
      login: '关闭钱包， 然后再次打开并登录',
    },

    app:{
      create: '生成交易文件',
      finalize: '确认交易文件并完结交易',
      httpSend: '通过 https/http/Tor 发送',
      createRespFile: '生成回应交易文件',
      httpReceive: '开启http端口接收',
      height:'同步高度',
      updateTitle: '发现新版本',
      updateMsg: '发现Niffer钱包的新版本, 请立刻更新! (下载并覆盖原有程序即可).',
      yes: '好的',
      no: '暂时不更新',

      hedwig: '用Hedwig收币',
      tor: '洋葱网络(Tor)'

    },

    info:{
      spendable: '可用余额',
      total: '总计',
      unfinalization: '等待对方完成',
      immature: '未成熟'
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
      copied: '已复制'
    },

    fileSend:{
      sendAmount: '发送数量',
      createTxFile: '生成交易文件',
      WrongAmount: '发送数量错误',
      saveMsg: '保存新生成的交易文件',
      CreateFailed: '生成交易文件错误',
      NotEnough: '没有足够的余额，请至少留下0.01作为手续费',
    },

    httpSend:{
      sendAmount: '发送数量',
      address:'发送地址',
      WrongAmount: '发送数量错误',
      NotEnough: '没有足够的余额，请至少留下0.01作为手续费',
      WrongAddress: '发送地址错误',
      WrongTxData: '交易数据生成失败',
      success: '交易成功',
      TxFailed: '交易失败',
      TxResponseFailed: '接收者回应失败',
      TxCreateFailed: '发起交易失败',
      salteVersion: '交易文件版本',
      salteVersionHelp: '如果发送交易失败，可以试下改变交易文件版本',
      noTor: '洋葱网络没有启动，需要先启动洋葱网络'
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
      password: '钱包密码 (用于启动http监听)',
      start: '启动',
      error: '没有输入密码.',
      failed: '启动失败，可能是密码错误',
      failed2: '监听失败，你的对外ip无法被访问到; 请使用交易文件的方法 或者 Hedwig 来收发Grin.',
      failed3: '无法获取你的IP地址，请过段时间再试下',
      failed4: '本地HTTP监听(http://127.0.0.1:3415)已经启动。但是你的对外ip无法被访问到; 请使用交易文件的方法 或者 Hedwig 来收发Grin.',
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
    },

    check: {
      title: '同步余额',
      checking: '正在同步，请耐心等待 ...',
      stop: '停止同步',

      
      tip:'完成同步余额可能需要10-30分钟.',
      introTitle: '介绍',

      intro1: '当你的本地钱包余额 和 Grin区块链上的余额不一致(可能是由于交易被取消或者发送失败等原因)时，可以使用 "同步余额" 功能.',
      intro2: '同步时，在Grin区块链的所有未花费的输出(uxtos)中，找到你可以使用的未花费的输出，相加就得到你的余额.',
      
      start: '开始同步',
      stopCheckMsg: '同步已经取消',
      checkedMsg: '同步完成'
    },

    lang: {
      title: '选择语言',
      lang: '语言',
      select: '选择'
    },

    gnode:{
      title: '本地Grin节点',
      tabStatus: '运行状态',
      tabPeers: '周边节点',
      tabLog: '运行日志',
      tabConfig: '设置',
      statusRunning: '运行中,可用',
      statusSyncing: '正在同步区块',
      statusToStart: '没有启动',
      status:'状态',
      localRemoteHeight: '本地节点高度/全网高度',
      nodeVersion: '节点版本',
      protocolVersion: '协议版本',
      connectedCount: '已连接到周边Grin节点数量',
      location: '区块数据存储的位置',
      size: '全节点区块数据大小',
      restart: '重启本地节点',
      height: '最新高度'
    },

    gnodeConfig:{
      warning: '普通用户推荐使用默认值 !',
      useLocalorNot: '(推荐)启用本地节点',
      connectMethod: '节点连接方式',
      remoteFirst: '优先使用远程. 当远程节点不可用, 使用本地节点',
      localFirst:  '(推荐)当本地节点同步完成时优先连接本地, 否则使用远程',
      remoteAllTime: '始终连接远程节点',
      localAllTime: '始终连接本地节点',
      background: '(推荐)钱包退出后，本地节点后台运行',
      restoreToDefault: '恢复默认值',
      saved: '设置已经保存, 重启钱包后生效.'
    },

    gnodeConfigModal:{
      config: '设置Grin本地节点',
      title: '设置Grin节点'
    },

    tor:{
      title: '洋葱网络(Tor)',
      tabStatus: '运行状态',
      tabLog: '运行日志',
      tabConfig: '设置',
      statusRunning: '洋葱网络运行中',
      statusFailed: '启动失败',
      statusStarting: '正在启动',
      statusToStart: '没有启动',
      status:'状态',
      start: '启动洋葱网络',
      restart: '重启洋葱网络',
      address: '洋葱网络(TOR)收币地址',
      
      tip: '收币时，请保持钱包在线.',
      tip2: '启动中...可能需要30-60秒',
      introTitle: '介绍',
      intro1: '洋葱网络(Tor)是一个自由开放的匿名通信网络。',
      intro2: '通过洋葱网络接收/发送 grin， 安全/匿名/去中心化。',
      intro3: '(如果你所在地区网络禁止了Tor，那么你需要设置HTTPS/SOCKS5代理来连接Tor。)',

      start: '启动洋葱网络',
      copy: '复制地址',
      copied: '地址已经复制到剪贴板',
      startWhenLaunch: '(推荐) 打开钱包，自动启动洋葱网络',
      proxy: '代理',
      proxyUser: '用户名',
      proxyPassword: '密码',
      proxyHelp: '通过代理连接Tor',
      optional: '可选',
      proxyHelp2: '代理示例: https://127.0.0.1:9009 或者 socks5://127.0.0.1:1080',

      error: '洋葱网络启动失败',
      errorNoCurl: '没有找到curl命令, 请先安装curl.',
      errorInvalidProxy: '无效代理',
      saved: '设置已经保存, 下次启动洋葱网络时生效.'
    },
    
  }
}
export default messages
