# Niffler Wallet

Français | [English](./README.md) | [简体中文](./README.zh-CN.md)

Niffler est une interface graphique de portefeuille [Grin](https://github.com/mimblewimble/grin) prête à l'emploi et conviviale.
Le nom 'Niffler' vient de ["harry potter"](https://harrypotter.fandom.com/wiki/Niffler).

### Dernière Version: 0.7.0

v0.7.0 support de Grin5

Il utilise la version officielle de [grin-wallet v5.0.3](https://github.com/mimblewimble/grin-wallet/releases/tag/v5.0.3) avec [grin v5.0.1](https://github.com/mimblewimble/grin/releases/tag/v5.0.1) pour le backend. 

Mac/Windows/Linux version:[https://github.com/grinfans/niffler/releases/tag/v0.7.0](https://github.com/grinfans/niffler/releases/tag/v0.7.0)

Le portefeuille Niffler dispose de **hedwig v1 relay service**, qui permet à un utilisateur sans IP publique de pouvoir recevoir des Grin très facilement :)

Autrement dit，**Vous pouvez prélever des Grin depuis n'importe quel échange ou pool de mineurs sans effort**.

[Un excellent didacticiel vidéo expliquant comment prélever des Grin depuis n'importe quel échange à l'aide du portefeuille Niffler.](https://www.youtube.com/watch?v=rufKWEv64o8)
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/rufKWEv64o8/0.jpg)](https://www.youtube.com/watch?v=rufKWEv64o8)

## Contact

Contactez moi (en anglais) à l'adresse: xiaojay@gmail.com

Group Telegram : https://t.me/nifflerwallet


<img src="/src/renderer/assets/logo.png" width="256"> Logo conçu par [@Duoasa](https://weibo.com/u/3197271025)

## Fonctionnalités

* Utilisation des [binaires Grin officiels](https://github.com/mimblewimble/grin/releases) pour le backend, et [elctron-vue](https://github.com/SimulatedGREG/electron-vue) pour l'IHM.

* Fonctionne sur mac/linux/windows, et supporte différents langages (actuellement Français, English et 简体中文)

## Capture d'écran

#### Création d'un nouveau portefeuille

![Créer un nouveau portefeuille](https://media.giphy.com/media/IeuEOtJvxCLqqiCCyr/giphy.gif)

#### Envoi de Grin


![Envoi de Grin](https://media.giphy.com/media/LO2sAR3HmocCdbTwEh/giphy.gif)

#### Réception de Grin
![Réception de Grin](https://media.giphy.com/media/iFbSw9rhh5fGVSzyZf/giphy.gif)


## Installation

*La version actuelle est compilée à partir de la branche [gw5](https://github.com/grinfans/Niffler/tree/gw5)*

``` bash
# clonage
git clone https://github.com/grinfans/niffler.git && cd niffler

# installation des dépendances
npm install
cd hedwig
npm install

# lancement du serveur avec rechargement à chaud sur localhost:9080
npm run dev

# compilation de l'application electron pour la production
npm run build
```

---

## Demande d'aide

Les "pull request" de code sont toujours les bienvenus.

~~Plus précisément, si un concepteur de la communauté pouvait faire un **logo** pour Niffler, il serait très apprécié :-)~~

Nous avons actuellement un magnifique logo <img src="/src/renderer/assets/logo.png" width="64"> de la communauté grin chinoise.

Logo conçu par [@Duoasa](https://weibo.com/u/3197271025), avec des remerciements également pour [@机械师区块链](https://weibo.com/u/6318956004)

La traduction dans d'autres langues est également convoitée. Pour cela récupérez le [dossier lang](https://github.com/grinfans/niffler/tree/master/src/lang).

Merci à [@yozx](https://github.com/yozx) pour la version russe.
