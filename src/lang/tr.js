const messages = {
    msg: {
      title: 'NifflerCüzdan',
      password: 'Şifre',
      passwordAgain: 'Şİfre tekrar gir',
      wrongPassword: 'Grin sahibi Api işlemi başlatılamadı, şifre yanlış olabilir',
      login_: 'Giriş ',
      logout: 'Çıkış',
      search: 'Ara',
      clearup: 'Temizle',
      jump: 'Jump',
  
      confirmed: 'Onaylandı',
      unconfirmed: 'Onaylanmadı',
      locked: 'Kilitli',
  
      send: 'Gönder',
      receive: 'AL',
  
      cancel: 'iPTAL',
      save: 'Save',
      welcome: 'Niffler Hoş Geldiniz',
      msg: 'Message',
      more: 'More',
      back: 'Back',
  
      remote: 'uzak',
      local: 'yerel',
  
      node: 'Node',
      remoteNode: 'Uzak node',
      localNode: 'Yerel node',
  
      other: 'Other',
  
      loading: 'Grin Node durumu güncelleniyor...',
      error: 'Hata',
      optional: 'Seçmeli',
      open: 'Aç',
      close: 'Kapa',
  
      address: 'Slatepack adesi',
  
      login: {
        walletExist: 'Mevcut Grin cüzdan verileri bulundu; lütfen orijinal şifre ile giriş yapın :-)',
        waitForLocalGnode: 'Yerel Grin Node başlamasını bekliyor',
        selectingGnode: 'Grin Node seçimi',
        gnode: 'Grin node'
      },
  
      remove:{
        title: 'Varolan Cüzdanı kaldır',
        warning: 'Dikkat !',
        info: 'Cüzdanı kaldırmadan önce, bu cüzdanda Grin olmadığından veya kurtarma ifadelerini tam olarak kaydettiğinizden emin olun.!',
        help: 'Onaylamak için aşağıdaki giriş kutusuna "kaldır" yazın',
        remove: 'Kaldır',
        success: 'Mevcut cüzdan kaldırıldı, lütfen Nifflerı yeniden başlatın.'
      },
  
      new_:{
        create: 'Yeni Cüzdan',
        restore: 'Kurtarma ifadesi aracılığıyla cüzdanı geri yükle',
        import: 'Cüzdan yedekleme dosyasını içe aktar'
      },
  
      create:{
        toNewMsg: 'Cüzdan bulunamadı. Hadi yeni bir cüzdan oluştur :-).',
        seedPhrase: 'Kurtarma ifadeleri',
        newWallet: 'Yeni Cüzdan',
        backupNote: 'Önemli! Cüzdanınızı daha sonra geri yüklemek için kurtarma ifadenizi yedeklediğinizden emin olun',
        backupFinish: 'Yedekleme tamamlandı. Cüzdanı kapatın, yeniden açıp,giriş yapın.',
        errorPasswdEmpty: 'Şifre boş olamaz',
        errorPasswdConsistency: 'Şifreyi tekrar gir',
        errorCreateFailed: 'Yeni vüzdan oluşturulurken bir hata oldu. Cüzdanı tekrar başlatın veya daha sonra tekrar deneyin.',
      },
  
      restore:{
        seedPhrase: 'Kurtarma ifadeleri',
        title: 'Cüzdanı kurtarma ifadesinden geri yükle',
        addSeedsInfo: 'Lütfen kurtarma ifadesinin kelimelerini tek tek girin',
        add: 'Ekle',
        invalid: 'Geçersiz kurtarma ifadesi',
        failed: 'Cüzdan kurtarma ifadesinden geri yüklenemedi',
        delete: 'Sil',
        added: 'Kurtarma ifadesi kelime girişi tamamlandı',
        newPassword: 'Yeni şifre oluştur',
        recover: 'Kurtar',
        reAdd: 'Kurtarma ifadelerini tekrar gir',
        recovered: 'Cüzdan başarıyla geri yüklendi ve cüzdan bakiyesi Grin blok zincirinden senkronize edilmeye başlandı.',
        restoring: '10 ila 30 dakika arasında sürebilir. Lütfen işlem sırasında cüzdanı kapatmayın. Lütfen bekleyin...',
        restored: 'Cüzdan başarıyla geri yüklendi ve bakiye senkronizasyonu tamamlandı',
        login: 'Cüzdanı kapatın, ardından yeniden açın ve oturum açın.',
      },
  
      app:{
        create: 'Slatepack oluştur',
        finalize: 'Sonlandır',
        httpSend: 'http/https ile gönder',
        createRespFile: 'Yanıt Slatepacki oluştur ',
        httpReceive: 'http alım portunu aç',
        height: 'Yükseklik',
        updateTitle: 'Yeni versiyon bulundu',
        updateMsg: 'Niffler Cüzdan  yeni bir sürümü bulundu. Lütfen güncelleyin! (Yükleyin ve orjinal programın üstüne kurun).',
        yes: 'Güncellemek için ilerle',
        no: 'Geçici olarak güncelleme',
  
        hedwig: 'Hedwig ile AL',
        tor: 'Tor ağı',
        address: 'Slatepack adresi',
      },
  
      info:{
        spendable: 'Harcanabilir',
        total: 'Toplam',
        unfinalization: 'Sonlandırılmamış',
        immature: 'Olgunlaşmamış'
      },
  
      txs:{
        tx: 'İşlemler',
        canceled: 'İptal edildi',
        noTxFound: 'İşlem bulunamadı',
        noTx: 'İşlem yok',
        cancelSuccess: 'İşlem başarıyla iptal edildi',
      },
  
      commit:{
        unspentCmt: 'Harcanmamış Çıktı Taahhüdü',
        heightCreated: 'Oluşturulduğunda blok yüksekliği',
        unspent: 'Harcanmamış',
        spent: 'HArcanmış',
        noCmtFound: 'Harcanmamış Çıktı Taahhüdü Bulunamadı',
        noCmt: 'Harcanmamış Çıktı Taahhüdü Yok',
        copied: 'Kopylaandı'
      },
  
      fileSend:{
        sendAmount: 'Gönderilecek miktar',
        createTxFile: 'Slatepack oluştur',
        WrongAmount: 'Yanlış miktar',
        WrongSlatepackAddress: 'Yanlış Slatepack adresi',
        saveMsg: 'Slatepack dosya olarak kaydet',
        CreateFailed: 'Yeni Slatepack oluşturulamadı',
        NotEnough: 'Yeterli bakiye yok, lütfen işlem ücreti için en az 0.01 bırakın.',
  
        slatepack: 'SLATEPACK',
        slatepackAddress: 'Alıcının Slatepack Adresi ',
        slatepackAddressTips: 'Slatepack adresi, işlemi şifrelemek ve ödeme kanıtı oluşturmak için kullanılır.',
        slatepackCreated: 'Slatepack oluşturuldu !',
  
        slatepackEncryptedTips: 'Bu Slatepack şifrelenmiştir. Herhangi bir kanalda transfer yapmak güvenlidir.',
        slatepackUnEncryptedTips: 'Bu Slatepack şifreli değil, lütfen güvenli kanal üzerinden gönderin.',
        copySlatepack: 'Kopyala',
        fileSlatepack: 'Slatepack dosya olarak kaydet',
        copied: 'Kopyalandı'
      },
  
      httpSend:{
        sendAmount: 'Gönderilecek miktar',
        sendMessage: 'Mesaj',
        optional: 'seçmeli',
        address: 'Gönderilecek adres',
        WrongAmount: 'Yanlış miktar',
        NotEnough: 'Yeterli bakiye yok, lütfen işlem ücreti için en az 0.01 bırakın.',
        WrongAddress: 'Yanlış gönderim adresi',
        WrongTxData: 'İşlem başarısız',
        success: 'İşlem başarılı',
        TxFailed: 'İşlem gönderilemedi',
        TxResponseFailed: 'Alıcı doğru yanıt vermedi',
        TxCreateFailed: 'İşlem oluşturulamadı',
        salteVersion: 'Slate dosya modeli',
        salteVersionHelp: 'Grini gönderemediyseniz, Slate dosya modelini değiştirmeyi deneyin ve ardından yeniden gönderin',
        noTor: 'Tor ağı başlatılmadı, önce onu başlatmalısınız.',   
      },
  
      fileReceive: {
        dropMsg: 'Alınan işlem dosyasını bırak',
        saveMsg: 'Yeni oluşturulan Slatepack yanıtını kaydet',
        CreateFailed: 'Slatepack yanıtı oluşturulamadı',
        NoSavePlace: 'Lütfen kaydetme konumunu seçin',
        WrongFileType: 'Yanlış işlem dosyası türü',
        toOpen: 'Slatepack dosyasını aç',
        toPaste: 'veya Slatepack kopyalayın, ardından aşağıdaki giriş kutusuna yapıştırın',
        create: 'Yanıt Slatepack oluştur',
        WrongSlatepack: 'Yanlış Slatepack içeriği',
        openMsg: 'Slatepack dosya aç',
        sender: 'Gönderici',
        slatepackCreated: 'Yanıt Slatepack oluşturuldu!',
        copySlatepack: 'Kopyala',
        fileSlatepack: 'Dosya olarak kaydet',
        copied: 'Kopyalandı',
      },
  
      finalize: {
        finalize: 'Sonlandır',
        success: 'Başarılı işlem',
        ok: 'OK',
        sending: 'Gönderiyor',
        dropMsg: 'Sonlandırmak için yanıt işlem dosyasını bırakın',
        WrongFileType: 'Yanlış işlem dosya türü',
        WrongSlatepack: 'Yanlış Slatepack içeriği',
        TxFailed: 'İşlem başarısız oldu',
        toPaste: 'veya Slatepacki kopyalayın ve aşağıdaki giriş kutusuna yapıştırın',
        toOpen: ' Slatepack dosyasını aç',
        send: 'İşlemi sonlandır ve gönder',
        openMsg: 'Slatepack dosyasını aç'
      },
  
      httpReceive: {
        launchSucess: 'Başarıyla başlatıldı',
        listening: "Cüzdan'ın HTTP bağlantı noktası dinliyor",
        address: 'Cüzdan adresi',
        reachableMsg2: 'Lütfen IP adresinizin harici kullanıcılar tarafından erişilebilir olduğundan emin olun',
        close: 'HTTP dinlemeyi durdur',
        attention: 'Dikkatn',
        reachableMsg: 'Çeviri sonuçları HTTP dinlemeye başlamak için İnternetten erişilebilen genel bir IP adresiniz olmalıdırt.',
        password: 'Cüzdan şifresi (HTTP dinleme için kullanılır)',
        start: 'Başlat',
        error: 'Şifre girilmedi.',
        failed: 'Başlatılamadı, şifre yanlış olabilir',
        failed2: 'HTTP dinleme başarısız, genel IP adresinize internetten ulaşılamıyor. Grin göndermek ve almak için lütfen işlem dosyalarını veya Hedwig yöntemini kullanın.',
        failed3: 'IP adresiniz alınamadı, lütfen daha sonra tekrar deneyin',
        failed4: 'Yerel HTTP dinleme çalışıyor (http://127.0.0.1:3415).Ancak, genel IP adresinize İnternetten ulaşılamıyor. İşlem için dosya veya Hedwig yöntemini deneyin.',
        ip: 'Genel IPniz'
      },
  
      hedwig: {
        title: 'Hedwigle(v1) Al',
        launchSucess: 'Başlatıldı',
        reachable: 'Hedwig geçici adresi mevcut',
        address: 'Alıcı adres',
        tip: 'Lütfen Grin alımı sırasında cüzdanınızı çevrimiçi tutun.',
        close: 'Hedwig Durdur',
        introTitle: 'Giriş',
        intro1: 'Hedwig(v1), genel IP adresi olmayan kullanıcılar için bir geçiş hizmetidir. Grin almak için geçici bir adres sağlar.',
        intro2: 'Birisi bu adrese Grin gönderdiğinde, Hedwig(v1) işlemi tamamlamak için talebi Niffler cüzdanınıza iletir.',
        start: 'Başlat',
        failed: 'Hedwig sunucusuna bağlanırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
        failed2: 'Hedwig adresine bağlanırken bir hata oluştu. Lütfen cüzdanı yeniden başlatın veya daha sonra tekrar deneyin.',
        failed3: 'Yerel Grin Alıcı Hizmeti başlatılamadı. Lütfen cüzdanı yeniden başlatın veya daha sonra tekrar deneyin.',
        copy: 'adresi kopyala',
        copied: 'Adres panoya kopyalandı'
      },
  
      check: {
        title: 'Bakiye Denetle ',
        checking: 'Denetleniyor, lütfen bekle...',
        stop: 'Denetleme Durdur',
  
  
        tip: 'Denetleme 10 veya 30 dk sürer',
        introTitle: 'Giriş',
  
        intro1: 'Cüzdan bakiyeniz Grin blok zincirindeki bakiyeyle tutarsız olduğunda (belki işlemin iptali veya gönderim hatası vb), "Bakiye Denetle" işlevini kullanın.',
        intro2: 'Kontrol sırasında, Grin blok zincirinin tüm harcanmamış çıktıları (UTXO) arasında, kullanabileceğiniz harcanmamış çıktıları bulun ve bakiyenizi almak için bunları ekleyin.',
        
        start: 'Başlat',
        stopCheckMsg: 'Denetleme iptal edildi',
        checkedMsg: 'Denetleme tamamlandı'
      },
  
      lang: {
        title: 'Dil seçimi',
        lang: 'Dil',
        select: 'Seç'
      },
  
      gnode:{
        title: 'Yerel Grin node',
        tabStatus: 'Durum',
        tabPeers: 'Eşler',
        tabLog: 'Kayıtlar',
        tabConfig: 'Ayarlar',
        statusRunning: 'Çalışıyor,mevcut',
        statusSyncing: 'Syncing...',
        statusToStart: 'Başlatılmadı',
        status: 'Status',
        localRemoteHeight: 'Yerel Yükseklik/Ağ Yüksekliği',
        nodeVersion: 'Node Versiyon',
        protocolVersion: 'Protokol Versiyon',
        connectedCount: 'Bağlanan Eşler',
        location: 'Blok veri depolama yeri',
        size: 'Full node blok veri boyutu',
        restart: 'yerel node tekrar Başlat',
        height: 'Yükseklik',
        remove: 'Mevcut blok data kaldırın ve sıfırdan senkronize edin',
        removeConfirm: 'Mevcut Grin blok verilerini kaldırdığınızdan emin misiniz?'
      },
  
      gnodeConfig:{
        warning: 'Sıradan kullanım için önerilen ayarları kullanın!',
        useLocalorNot: '(Tavsiye) Yerel Grin Node kullanın',
        connectMethod: 'Node bağlantı metodu',
        remoteFirst: 'Önce uzak Grin NODE kullanın. Uzak Node mevcut olmadığında, yerel Node kullanın..',
        localFirst:  '(Tavsiye) Yerel Node eşitlendiğinde, önce yerel bağlantı, ardından gerekirse uzak bağlantı kullanılır.',
        remoteAllTime: 'Her zaman uzak Node bağlan',
        localAllTime: 'Her zaman yerel Node bağlan',
        background: '(Tavsiye) Niffler kapalıyken Grin Node arka planda çalıştırmaya devam edin.',
        restoreToDefault: 'Varsayılan ayarlara dön',
        saved: 'Ayarlar kaydedildi ve cüzdanı yeniden başlattıktan sonra geçerli olacak.'
      },
  
      gnodeConfigModal:{
        config: 'Grin Yerel Node Ayarları',
        title: 'Grin node ayarları'
      },
  
      tor:{
        title: 'Tor',
        tabStatus: 'Durum',
        tabLog: 'Log',
        tabConfig: 'Durum',
        statusRunning: 'Tor Çalışıyor',
        statusFailed: 'Tor başlatılamadı',
        statusStarting: 'Tor Başlıyor',
        statusToStart: 'Çalışmıyor',
        status: 'Durum',
        start: 'başlat',
        restart: 'Tekrar Başlat',
        address: 'Grin almak için Tor adresi ',
        
        tip: 'Lütfen Grin alırken czdanı açık tutun',
        tip2: 'Başlıyor...  30-60 saniye sürebilir',
        introTitle: 'Giriş',
        intro1: 'Tor, anonim iletişim sağlamak için ücretsiz ve açık kaynaklı bir yazılımdır.',
        intro2: 'Grin Tor üzerinden alma/gönderme anonim, güvenli ve merkezi olmayan bir işlemdir',
        intro3: '(Tor ağınızda yasaklanmışsa, önce bir HTTPS/SOCKS5 proxy yapılandırın.)',
  
        copy: 'Adresi kopyala',
        copied: 'Adres panoya kopyalandı',
        startWhenLaunch: '(Tavsiye) Cüzdan açılışında Tor otomatik başlat',
        proxy: 'proxy',
        proxyUser: 'kullanıcı adı',
        proxyPassword: 'şifre',
        proxyHelp: 'Tora proxy ile bağlan',
        optional: 'Seçmeli',
        proxyHelp2: 'Proxy örnek: https://127.0.0.1:9009 veya socks5://127.0.0.1:1080',
  
        error: 'Tor ağı başlatma başarısız.',
        errorNoCurl: 'curl komutu bulunamadı, lütfen önce cURL yükleyin.',
        errorNoTor: 'Tor bulunamadı, lütfen önce Tor yükleyin.',
        errorInvalidProxy: 'Geçersiz proxy',
        saved: 'Ayarlar kaydedildi ve Tor ağı bir sonraki başlatılışında geçerli olacak.'
      },
  
      gaddress:{
        address: ' Slatepack adresiniz',
        copied: 'Kopyalandı',
        copy: 'Slatepack adresi kopyala',
        tips: 'Slatepack adresi, işlemi şifrelemek ve ödeme kanıtı oluşturmak için kullanılır. Grin blok zincirinde saklanmaz.'
      },
  
      log: {
        title: 'Dışa aktar Log',
        saveMsg: "Bugünün Niffler cüzdan log dışa aktarın.",
      }
  
    }
  }
  export default messages
  