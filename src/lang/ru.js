const messages = {
  msg: {
    title: 'Niffler кошелек',
    password: 'Пароль',
    passwordAgain: 'Введите пароль повторно',
    wrongPassword: 'Неверный пароль',
    login_: 'Войти',
    logout: 'Выйти',
    search: 'Поиск',
    clearup: 'Очистить',
    jump: 'Перейти',

    confirmed: 'Подтверждено',
    unconfirmed: 'Не подтверждено',
    locked: 'Заблокировано',
    
    send: 'Отправить',
    receive: 'Получить',

    cancel:'Отменить',
    save: 'Сохранить',

    welcome: 'Добро пожаловать в Niffler кошелек',
    
    msg: 'Сообщение',
    more: 'Больше',

    back: 'отступать',
    
    remote: 'remote',
    local: 'local',

    node: 'Node',
    remoteNode: 'Remote node',
    localNode: 'Local node',

    other: 'Others',

    login: {
      walletExist: 'Данные grin кошелька найдены; Войти с оригинальным паролем :-)',
    },
    
    create:{
      seedPhrase: 'Сид-фраза',
      toNewMsg: 'Кошелек не найден. Создать новый',
      newWallet: 'Создать новый кошелек',
      backupNote: 'Сделайте бекап！Пожалуйста, сохраните вашу сид-фразу, без нее вы не сможете восстановить кошелек',
      backupFinish: 'Я сохранил мою сид-фразу в надежном месте. Войти в кошелек',
      errorPasswdEmpty: 'Поле пароля не может быть пустым',
      errorPasswdConsistency: 'Пароли не совпадают',
      errorCreateFailed: 'Ошибка при создании нового кошелька. Попробуйте перезапустить кошелек и попробуйте снова.',
    },

    new_:{
      create: 'Создать новый кошелек',
      restore: 'Восстановить кошелек с помощью сид фразы',
      import: 'Импортить бекап файл кошелька'
    },
    
    restore:{
      seedPhrase: 'Сид-фраза',
      title: 'Восстановление кошелька с помощью сид-фразы',
      addSeedsInfo: 'Пожалуйста, введите слова по одному',
      add: 'Добавить',
      invalid: 'Сид-фраза недействительна',
      failed: 'Recover wallet from seeds Failed',
      delete: 'Удалить',
      added: 'Ввод сид-фразы завершен',
      newPassword: 'Установить новый пароль',
      recover: 'Восстановить',
      reAdd: 'Ввести сид-фразу повторно ',
      recovered: 'Кошелек восстановлен, пришло время проверить баланс',
      restoring: 'Проверка займет 10-30 минут. Пожалуйста, будьте терпеливы..',
      restored: 'Кошелек восстановлен, баланс проверен.',
      login: 'Вход в кошелек',
    },

    app:{
      create: 'Создать файл транзакции',
      finalize: 'Заверишть',
      httpSend: 'Отправить через http/https',
      createRespFile: 'Создать ответный файл транзакции',
      httpReceive: 'Получить по http',
      height:'Высота',
      updateTitle: 'Найдена новая версия',
      updateMsg: 'Найдена новая версия Niffler кошелка. Обновить прямо сейчас?',
      yes: 'Да',
      no: 'Нет',
      hedwig: 'Получить через Hedwig'
    },

    info: {
      spendable: 'Расходуемые',
      total: 'Всего',
      unfinalization: 'Hезаконченный',
      immature: 'Hезрелый'
    },

    txs:{
      tx: 'Транзакции',
      canceled:'Отмененные',
      noTxFound: 'Транзакции не найдены',
      noTx:'Нет транзакций',
      cancelSuccess:'Эта транзакция отменена',
    },

    commit:{
      unspentCmt: 'Неизрасходованный вывод транзакции',
      heightCreated: 'Высота блока при создании',
      unspent: 'Неизрасходованный',
      spent: 'Израсходованный',
      noCmtFound: 'No Unspent Output Commit Found',
      noCmt:'No Unspent Output Commit',
    },

    fileSend:{
      sendAmount: 'Сумма для отправки',
      createTxFile: 'Создать новый файл транзакции',
      WrongAmount: 'Неверная сумма',
      saveMsg: 'Сохранить созданный файл транзакции',
      CreateFailed: 'Не удалось создать новый файл транзакции',
      NotEnough: 'Недостаточно средств. Оставьте 0.01 для комиссии'
    },

    httpSend:{
      sendAmount: 'Сумма для отправки',
      address:'Адрес',
      WrongAmount: 'Неверная сумма',
      NotEnough: 'Недостаточно средств. Оставьте 0.01 для комиссии',
      WrongAddress: 'Неверный адрес',
      WrongTxData: 'Не удалось создать транзакцию',
      success: 'Успешная транзакция',
      TxFailed: 'Ошибка отправки транзакции',
      TxResponseFailed: 'Failed to get right respose from receiver',
      salteVersion: 'Версия Slate файла',
      salteVersionHelp: 'Если вам не удалось отправить Grin, попробуйте изменить версию Slate файла'
    },

    fileReceive: {
      dropMsg: 'Удалить полученный файл транзакции',
      WrongFileType: 'Неверный тип файла транзакции',
      saveMsg: 'Сохранить созданный файл ответа',
      CreateFailed: 'Не удалось создать новый файл ответной транзакции',
      NoSavePlace: 'Пожалуйста, выберите место для сохранения',
    },

    finalize: {
      finalize: 'Завершить',
      success: 'Успешная транзакция',
      ok:'OK',
      sending: 'Отправка',
      dropMsg: 'Удалить файл транзакции ответа для завершения',
      WrongFileType: 'Неверный тип файла транзакции',
      TxFailed: 'Ошибка транзакции',
    },

    httpReceive: {
      launchSucess: 'Успешный запуск',
      listening: "Процесс прослушивания HTTP кошелька запущен",
      address: 'Адрес кошелька',
      reachableMsg2: 'Убедитесь, что ваш IP доступен для других пользователей интернет-сети (Публичный IP)',
      close: 'Прекратить прослушивание',
      attention: 'Внимание',
      reachableMsg: 'Чтобы начать прослушивание HTTP, у вас должен быть публичный IP, доступный для пользователей интернет-сети.',
      password: 'Пароль кошелька (используется для запуска HTTP-прослушивания)',
      start: 'Запустить',
      error: 'Нет пароля',
      failed: 'Не удалось запустить, возможно введен неверный пароль',
      failed2: 'Сбой при прослушивании HTTP, ваш публичный IP недоступен для других пользователей. Попробуйте использовать отправку файла транзакции или Hedwig.',
      failed3: 'Не удалось получить ваш публичный IP; попробуйте позже',
      failed4: 'Localhost http listen is running(http://127.0.0.1:3415). Howerver, your public ip could not reachable by internet user. Try trascation file Or Hedwig.',
      ip: 'Ваш публичный IP'
    },

    hedwig: {
      title: 'Получить через Hedwig(v1)',
      launchSucess: 'Успешный запуск',
      reachable: 'Hedwig адрес доступен',
      address: 'Адрес для получения',
      tip:'Пожалуйста, держите кошелек онлайн.',
      close: 'Остановить Hedwig',
      introTitle: 'Введение',
      intro1: 'Hedwig(v1) представляет из себя ретранслятор для пользователей без публичного IP, предоставляя временный адрес для получения Grin.',
      intro2: 'Когда кто-то отправляет Grin на адрес, Hedwig(v1) перешлет отправку запроса на ваш кошелек. Таким образом, вы получите свои Grin.',
      start: 'Запустить',
      failed: 'Ошибка при попытке подключиться к серверу Hedwig, попробуйте позже.',
      failed2: 'Ошибка при проверке адреса Hedwig, попробуйте позже или перезапустите кошелек.',
      failed3: 'Ошибка при запуске локального сервиса получения Grin, попробуйте позже или перезапустите кошелек.',
      copy: 'Скопировать адрес',
      copied: 'Адрес был скопирован в буфер обмена'
    },

    check: {
      title: 'Проверить баланс',
      checking: 'Проверяю, ожидайте ...',
      stop: 'Остановить проверку',

      tip:'Проверка занимает 10-30 минут',
      introTitle: 'Введение',

      intro1: 'Из-за всех возможностей, доступных для отмены, а также вероятных форков цепи, вполне возможно, что ваш кошелек окажется в несовместимом состоянии',
      intro2: "По этой причине Grin предоставляет команду проверки вручную, которая сканирует набор UTXO-цепочки для любых выходов, принадлежащих вашему кошельку, и обеспечивает их соответствие с вашей локальной базой данных кошелька.",
      
      start: 'Запуск',
      stopCheckMsg: 'Проверка была прервана'
    },
    
    lang: {
      title: 'Выберите язык',
      lang: 'язык',
      select: 'Выбрать'
    },

    gnode:{
      title: 'Local grin node',
      tabStatus: 'Status',
      tabPeers: 'Peers',
      tabLog: 'Log',
      tabConfig: 'Settings',
      statusRunning: 'Running, Available',
      statusSyncing: 'Syncing ...',
      statusToStart: 'not Runing',
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
      remoteFirst: '(Recommend)Remote grin node is preferred, When remote node is not available, use local node.',
      localFirst:  'Local grin node is preferred when it is synced. Otherwise, use remote node.',
      remoteAllTime: 'Use remote all the time',
      localAllTime: 'Use local all the time',
      background: '(Recommend)Runing grin node background when Niffler is closed.',
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

  }
}
export default messages
