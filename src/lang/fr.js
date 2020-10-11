const messages = {
  msg: {
    title: 'Niffler Wallet',
    password: 'Mot de passe',
    passwordAgain: 'Saisissez à nouveau le mot de passe',
    wrongPassword: 'Le processus Grin owner Api n\'a pas pu démarrer, le mot de passe est peut-être erroné',
    login_: 'Connexion',
    logout: 'Déconnexion',
    search: 'Rehercher',
    clearup: 'Nettoyer',
    jump: 'Sauter',

    confirmed: 'Confirmé',
    unconfirmed: 'Non confirmé',
    locked: 'Verrouillé',
    
    send: 'Envoyer',
    receive: 'Recevoir',

    cancel: 'Annuler',
    save: 'Enregistrer',
    welcome: 'Bienvenue dans le portefeuille Niffler',
    msg: 'Message',
    more: 'Plus',
    back: 'Précédent',

    remote: 'distant',
    local: 'local',

    node: 'Noeud',
    remoteNode: 'Noeud distant',
    localNode: 'Noeud local',

    other: 'Autre',

    loading: 'Mise à jour de l\'état depuis le noeud Grin...',
    error: 'Erreur',
    optional: 'Optionnel',
    open: 'Ouvrir',
    close: 'Fermer',

    address: 'Adresse Slatepack',

    login: {
      walletExist: 'Des données de portefeuille Grin ont été trouvées. Veuillez vous connecter avec le mot de passe d\'origine :-)',
      waitForLocalGnode: 'En attente du démarrage du noeud Grin local',
      selectingGnode: 'Sélection du noeud Grin',
      gnode: 'Noeud Grin'
    },

    remove:{
      title: 'Supprimer le portefeuille actuel',
      warning: 'Attention !',
      info: 'Avant de supprimer le portefeuille, veuillez vous assurer qu\'il ne reste pas de Grin dans le portefeuille actuel ou que vous avez bien sauvegardé la phrase de récupération !',
      help: 'Saisir "supprimer" dans la zone de saisie ci-dessous pour confirmer',
      remove: 'Supprimer',
      success: 'Le portefeuille actuel a été supprimé, veuillez redémarrer Niffler.'
    },

    new_:{
      create: 'Créer un nouveau portefeuille',
      restore: 'Restaurer un portefeuille avec sa la phrase de récupération',
      import: 'Importer un fichier de sauvegarde de portefeuille'
    },

    create:{
      toNewMsg: 'Aucun portefeuille existant n\'a été trouvé. Créons-en un nouveau :-)',
      seedPhrase: 'Phrase de récupération',
      newWallet: 'Créer un nouveau portefeuille',
      backupNote: 'Important ! Sauvegardez et conservez précieusement la phrase de récupération pour pouvoir restaurer le portefeuille ultérieurement.',
      backupFinish: 'Une fois la sauvegarde de la phrase de récupération terminée, fermez le portefeuille, puis ouvrez le à nouveau afin de vous connecter.',
      errorPasswdEmpty: 'Le mot de passe ne peut pas être vide',
      errorPasswdConsistency: 'Veuillez saisir le même mot de passe',
      errorCreateFailed: 'Une erreur s\'est produite lors de la création du nouveau portefeuille, tentez de redémarrer le portefeuille ou de réessayer plus tard.',
    },

    restore:{
      seedPhrase: 'Phrase de récupération',
      title: 'Récupérer un portefeuille grâce à sa phrase de récupération',
      addSeedsInfo: 'Veuillez saisir les mots de la phrase de récupération un par un',
      add: 'Ajouter',
      invalid: 'Phrase de récupération incorrecte',
      failed: 'Échec de récupération du portefeuille à partir de la phrase de récupération',
      delete: 'Supprimer',
      added: 'Saisie de la phrase de récupération terminée',
      newPassword: 'Définir un nouveau mot de passe',
      recover: 'Récupérer le portefeuille',
      reAdd: 'Ressaisir',
      recovered: 'Le portefeuille a été restauré avec succès. Le solde du portefeuille doit maintenant être synchronisé avec la blockchain Grin.',
      restoring: 'Cela devrait prendre entre 10 et 30 minutes. Veuillez ne pas fermez le portefeuille durant l\'opération. Veuillez patienter...',
      restored: 'Le portefeuille a été restauré et le solde a été synchronisé avec succès.',
      login: 'Fermez le portefeuille, puis ouvrez-le à nouveau pour vous reconnecter',
    },

    app:{
      create: 'Générer un Slatepack',
      finalize: 'Confirmer le Slatepack et clôturer la transaction',
      httpSend: 'Envoyer via http/https',
      createRespFile: 'Générer un Slatepack de réponse',
      httpReceive: 'Ouvrir le port de réception http',
      height: 'Hauteur',
      updateTitle: 'Nouvelle version détectée',
      updateMsg: 'Une nouvelle version du portefeuille Niffler a été détectée. Mettez le à jour dès maintenant ! (Téléchargez le et écrasez le programme d\'origine).',
      yes: 'Procéder à la mise à jour',
      no: 'Ne pas mettre à jour temporairement',

      hedwig: 'Recevoir via Hedwig',
      tor: 'Réseau Tor',
      address: 'Adresse Slatepack',
    },

    info:{
      spendable: 'Solde disponible',
      total: 'Total',
      unfinalization: 'Non finalisé',
      immature: 'Immature'
    },

    txs:{
      tx: 'Transactions',
      canceled: 'Annulé',
      noTxFound: 'Aucune transaction trouvée',
      noTx: 'Aucune transaction',
      cancelSuccess: 'Transaction annulée avec succès',
    },

    commit:{
      unspentCmt: 'Transactions sortantes non dépensées',
      heightCreated: 'Hauteur du bloc lors de sa création',
      unspent: 'Disponible',
      spent: 'Dépensé',
      noCmtFound: 'Aucune transaction sortante trouvée',
      noCmt: 'Aucune transaction sortante non dépensée',
      copied: 'Copié'
    },

    fileSend:{
      sendAmount: 'Montant envoyé',
      createTxFile: 'Générer un Slatepack',
      WrongAmount: 'Montant envoyé incorrect',
      WrongSlatepackAddress: 'L\'adresse Slatepack est erronée',
      saveMsg: 'Enregistrer le fichier slatepack nouvellement généré',
      CreateFailed: 'Échec de la création d\'un nouveau Slatepack',
      NotEnough: 'Le solde est insuffisant, veuillez laisser au moins 0,01 pour les frais de traitement',

      slatepack: 'SLATEPACK',
      slatepackAddress: 'Adresse Slatepack du destinataire',
      slatepackAddressTips: 'L\'adresse Slatepack est utilisée pour crypter la transaction et créer une preuve de paiement.',
      slatepackCreated: 'Le Slatepack a été généré !',

      slatepackEncryptedTips: 'Ce slatepack est crypté et peut être envoyé sur des canaux non cryptés.',
      slatepackUnEncryptedTips: 'Ce slatepack n\'est pas crypté, veuillez l\'envoyer via un canal sécurisé.',
      copySlatepack: 'Copier',
      fileSlatepack: 'Exporter vers un fichier',
      copied: 'Copié'
    },

    httpSend:{
      sendAmount: 'Montant envoyé',
      sendMessage: 'Message',
      optional: 'optionnel',
      address: 'Adresse d\'envoi',
      WrongAmount: 'Montant envoyé incorrect',
      NotEnough: 'Le solde est insuffisant, veuillez laisser au moins 0,01 pour les frais de traitement',
      WrongAddress: 'Adresse d\'envoi incorrecte',
      WrongTxData: 'Échec de génération des données de transaction',
      success: 'Transaction réussie',
      TxFailed: 'La transaction a échoué',
      TxResponseFailed: 'Le destinataire n\'a pas répondu correctement',
      TxCreateFailed: 'Echec de lancement de la transaction',
      salteVersion: 'Version du fichier de transaction',
      salteVersionHelp: 'Si la transaction d\'envoi échoue, vous pouvez essayer de modifier la version du fichier de transaction',
      noTor: 'Le réseau Tor n\'est pas démarré, vous devez d\'abord le démarrer.',   
    },

    fileReceive: {
      dropMsg: 'Déposer le fichier de transaction reçu',
      saveMsg: 'Enregistrez le fichier de réponse Slatepack nouvellement généré',
      CreateFailed: 'Échec de la création d\'un Slatepack de réponse',
      NoSavePlace: 'Veuillez sélectionner l\'emplacement de génération des fichiers de transaction',
      WrongFileType: 'Type de fichier de transaction incorrect',
      toOpen: 'Ouvrir un fichier Slatepack',
      toPaste: 'ou copiez-collez le Slatepack dans la zone de saisie ci-dessous',
      create: 'Générer un Slatepack de réponse',
      WrongSlatepack: 'Le contenu du Slatepack est incorrect',
      openMsg: 'Ouvrir un fichier Slatepack',
      sender: 'Expéditeur',
      slatepackCreated: 'Slatepack de réponse généré !',
      copySlatepack: 'Copier',
      fileSlatepack: 'Exporter vers un fichier',
      copied: 'Copié',
    },

    finalize: {
      finalize: 'Clôture de la transaction',
      success: 'Transaction réussie',
      ok: 'OK',
      sending: 'Envoi en cours',
      dropMsg: 'Déposer le fichier de transaction de réponse pour finaliser',
      WrongFileType: 'Type de fichier de transaction incorrect',
      WrongSlatepack: 'Le contenu de Slatepack est incorrect',
      TxFailed: 'La transaction a échoué',
      toPaste: 'ou copiez-collez le Slatepack dans la zone de saisie ci-dessous',
      toOpen: 'Ouvrir un fichier Slatepack',
      send: 'Finaliser et envoyer la transaction',
      openMsg: 'Ouvrir un fichier Slatepack'
    },

    httpReceive: {
      launchSucess: 'Démarré avec succès',
      listening: 'Port HTTP du portefeuille à l\'écoute',
      address: 'Adresse du portefeuille',
      reachableMsg2: 'Veuillez vous assurer que votre adresse IP est accessible aux utilisateurs externes',
      close: 'Désactiver l\'écoute HTTP',
      attention: 'Attention',
      reachableMsg: 'Pour démarrer l\'écoute HTTP, vous devez disposer d\'une adresse IP publique, accessible depuis Internet',
      password: 'Mot de passe du portefeuille (utilisé pour démarrer l\'écoute HTTP)',
      start: 'Démarrer',
      error: 'Aucun mot de passe saisi.',
      failed: 'Échec du démarrage, le mot de passe est peut être incorrect',
      failed2: 'L\'écoute HTTP a échoué, votre adresse IP publique n\'est pas accessible depuis Internet. Veuillez utiliser la méthode des fichiers de transaction ou Hedwig pour l\'envoi et la réception de Grin.',
      failed3: 'Impossible d\'obtenir votre adresse IP, veuillez réessayer plus tard',
      failed4: 'L\'écoute HTTP locale est en cours (http://127.0.0.1:3415). Cependant, votre adresse IP publique n\'est pas accessible depuis Internet. Veuillez utiliser la méthode des fichiers de transaction ou Hedwig pour l\'envoi et la réception de Grin.',
      ip: 'Votre IP publique'
    },

    hedwig: {
      title: 'Reception via Hedwig(v1)',
      launchSucess: 'Démarré avec succès',
      reachable: 'L\'adresse temporaire Hedwig est disponible',
      address: 'Adresse de réception',
      tip: 'Veuillez garder votre portefeuille en ligne durant la réception.',
      close: 'Arrêter Hedwig',
      introTitle: 'Introduction',
      intro1: 'Hedwig(v1) est un service de proxy personnalisé pour les utilisateurs ne disposant pas d\'adresse IP publique. Il fournit une adresse de paiement temporaire.',
      intro2: 'Lorsque quelqu\'un envoie des Grin à cette adresse, Hedwig(v1) transmet la requête à votre portefeuille Niffler pour procéder à la transaction.',
      start: 'Démarrer',
      failed: 'Une erreur s\'est produite lors de la connexion au serveur Hedwig, veuillez réessayer plus tard',
      failed2: 'Une erreur s\'est produite lors de la connexion à l\'adresse temporaire Hedwig. Veuillez redémarrer le portefeuille ou réessayer plus tard.',
      failed3: 'Échec de démarrage du service de réception de Grin local. Veuillez redémarrez le portefeuille ou réessayer plus tard.',
      copy: 'Copier l\'adresse',
      copied: 'L\'adresse a été copiée dans le presse-papiers'
    },

    check: {
      title: 'Synchroniser le solde',
      checking: 'Synchronisation, veuillez patienter...',
      stop: 'Stopper la synchronisation',


      tip: 'La synchronisation du solde prendra entre 10 et 30 minutes',
      introTitle: 'Introduction',

      intro1: 'Lorsque le solde de votre portefeuille local est en incohérence avec le solde de la blockchain Grin (peut-être en raison de l\'annulation de la transaction ou de l\'échec de l\'envoi), vous pouvez utiliser la fonction "Synchroniser le solde".',
      intro2: 'Pendant la synchronisation, parmi toutes les sorties de transaction de solde (UXTOs) de la blockchain Grin, trouvez les sorties non dépensées que vous pouvez utiliser et ajoutez-les pour obtenir votre solde.',
      
      start: 'Démarrer la synchronisation',
      stopCheckMsg: 'La synchronisation a été annulée',
      checkedMsg: 'Synchronisation du solde terminée'
    },

    lang: {
      title: 'Choisir la langue',
      lang: 'Langue',
      select: 'Sélectionner'
    },

    gnode:{
      title: 'Noeud Grin local',
      tabStatus: 'État',
      tabPeers: 'Noeuds périphériques',
      tabLog: 'Journal',
      tabConfig: 'Paramètres',
      statusRunning: 'En fonctionnement, disponible',
      statusSyncing: 'Synchronisation du bloc...',
      statusToStart: 'Non démarré',
      status: 'État',
      localRemoteHeight: 'Hauteur noeud local/Hauteur réseau',
      nodeVersion: 'Version du noeud',
      protocolVersion: 'Version du protocole',
      connectedCount: 'Nombre de noeuds Grin connectés',
      location: 'Emplacement du stockage des données de bloc',
      size: 'Taille des données de bloc du noeud complet',
      restart: 'Redémarrer le noeud local',
      height: 'Hauteur',
      remove: 'Supprimer les données de bloc et resynchroniser',
      removeConfirm: 'Êtes-vous sûr de vouloir supprimer les données actuelles du bloc Grin ?'
    },

    gnodeConfig:{
      warning: 'En usage courant, le paramétrage par défaut est le plus adapté !',
      useLocalorNot: '(Recommandé) Activer le noeud local',
      connectMethod: 'Méthode de connexion de noeud',
      remoteFirst: 'Utiliser d\'abord le noeud distant. Lorsque le noeud distant n\'est pas disponible, le noeud local est utilisé.',
      localFirst:  '(Recommandé) Lorsque la synchronisation du noeud local est terminée, le connexion locale est utilisée préférentiellement et la connexion distante le cas échéant.',
      remoteAllTime: 'Toujours se connecter au noeud distant',
      localAllTime: 'Toujours se connecter au noeud local',
      background: '(Recommandé) Poursuivre l\'exécution du noeud Grin en arrière-plan à la fermeture de Niffler.',
      restoreToDefault: 'Restaurer les paramètres par défaut',
      saved: 'Les paramètres ont été sauvegardés et prendront effet après le redémarrage du portefeuille.'
    },

    gnodeConfigModal:{
      config: 'Configurer du noeud Grin local',
      title: 'Configurer le noeud Grin'
    },

    tor:{
      title: 'Réseau Tor',
      tabStatus: 'État',
      tabLog: 'Journal',
      tabConfig: 'Paramètres',
      statusRunning: 'Le réseau Tor fonctionne',
      statusFailed: 'Le démarrage a échoué',
      statusStarting: 'Démarré',
      statusToStart: 'Non démarré',
      status: 'État',
      start: 'Démarrer le réseau Tor',
      restart: 'Redémarrer le réseau Tor',
      address: 'Adresse de réception du réseau Tor',
      
      tip: 'Veuillez garder le portefeuille en ligne durant la réception de Grin',
      tip2: 'Démarrage... cela peut prendre 30 à 60 secondes',
      introTitle: 'Introduction',
      intro1: 'The Onion Network (Tor) est un réseau de communication anonyme dont les sources sont libres et open-source.',
      intro2: 'Envoyer/recevoir des Grin via Tor est securisé, anonyme et décentralisé',
      intro3: '(Si Tor est interdit sur votre réseau, vous devez configurer un proxy HTTPS/SOCKS5 pour vous connecter.)',

      copy: 'Copier l\'adresse',
      copied: 'L\'adresse a été copiée dans le presse-papiers',
      startWhenLaunch: '(Recommandé) Démarrage automatique de Tor à l\'ouverture du portefeuille',
      proxy: 'proxy',
      proxyUser: 'Nom d\'utilisateur',
      proxyPassword: 'Mot de passe',
      proxyHelp: 'Connexion au réseau Tor via un proxy',
      optional: 'Optionnel',
      proxyHelp2: 'Exemple de proxy: https://127.0.0.1:9009 ou socks5://127.0.0.1:1080',

      error: 'Echec du démarrage du réseau Tor.',
      errorNoCurl: 'La commande curl est introuvable, veuillez d\'abord installer cURL.',
      errorNoTor: 'Tor n\'a pas été trouvé, veuillez d\'abord installer Tor.',
      errorInvalidProxy: 'Proxy invalide',
      saved: 'Les paramètres ont été enregistrés et prendront effet au prochain démarrage du réseau Tor.'
    },

    gaddress:{
      address: 'Votre adresse Slatepack',
      copied: 'Copié',
      copy: 'Copier l\'adresse Slatepack', 
      tips: 'L\'adresse Slatepack est utilisée pour crypter la transaction et créer une preuve de paiement. Elle n\'est pas stockée sur la blockchain Grin.'
    },

    log: {
      title: 'Exporter le journal',
      saveMsg: "Exporter le journal du portefeuille Niffler.",
    }

  }
}
export default messages
