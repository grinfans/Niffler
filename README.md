# Niffler Wallet

English | [简体中文](./README.zh-CN.md) | [Français](./README.fr-FR.md)

Niffler is a out-of-the box user-friendly gui [Grin](https://github.com/mimblewimble/grin) wallet.
The name 'Niffler' comes from ["harry potter"](https://harrypotter.fandom.com/wiki/Niffler).

* It's using the [official Grin binaries](https://github.com/mimblewimble/grin/releases) as back-end.

* It's using [electron-vue](https://github.com/SimulatedGREG/electron-vue) to build the Niffler Wallet gui front-end.

* It works on mac/linux/windows, and supports multiple languages.

<img src="/src/renderer/assets/logo.png" width="256"> Logo made by [@Duoasa](https://weibo.com/u/3197271025)

## Table of Contents
 - [Development resources](#development-resources)
 - [Vulnerability response](#vulnerability-response)
 - [License](#license)
 - [Translations](#translations)
 - [Contributing](#contributing)
 - [Latest Version](#latest-version)
 - [Video tutorial](#video-tutorial)
 - [Usage](#usage)
 - [Compiling from source](#compiling-from-source)
    - [Dependencies](#dependencies) 
    - [Build instructions](#build-instructions)
 - [Credits](#credits)

## Development resources
- GitHub: [https://github.com/grinfans/Niffler](https://github.com/grinfans/Niffler)
- Mail:  [xiaojay@gmail.com](mailto:xiaojay@gmail.com)   
- Telegram: https://t.me/nifflerwallet

## Vulnerability response
- [GitHub Niffler issues](https://github.com/grinfans/Niffler/issues)

## License

Apache-2.0 License, see [LICENSE](LICENSE).

## Translations
The Nifler wallet is available in different languages.
English, 简体中文, French, Russian, Dutch.

Translation to other languages is welcome. Please check our [lang folder](https://github.com/grinfans/niffler/tree/master/src/lang).
If you want to help translate it, then translate the next text file [en.js](https://github.com/grinfans/Niffler/blob/gw4/src/lang/en.js) to your local language.
Or better, send a github pull request similar like [this](https://github.com/grinfans/Niffler/pull/66/files).

## Contributing

Code pull requests are always welcome. If you want to help out, please send [pull requests](https://github.com/grinfans/Niffler/pulls).


### Latest Version

v0.6.1 support Grin4 with slatepack

Niffler Wallet uses the official [grin-wallet v4.0.0](https://github.com/mimblewimble/grin-wallet/releases/tag/v4.0.0) and [grin v4.1.0](https://github.com/mimblewimble/grin/releases/tag/v4.1.0) as backend. 

Mac/Windows/Linux version:[https://github.com/grinfans/niffler/releases/tag/v0.6.1](https://github.com/grinfans/niffler/releases/tag/v0.6.1)

Niffler wallet has a **hedwig v1 relay service**, which enable users without public ip receive grin really easy :)

In other words，**You could withdraw grin from any exchanges and miner pool effortlessly**.


## Video tutorial

[A great video tutorial of how to withdraw grin from any exchanges using Niffler wallet.](https://www.youtube.com/watch?v=rufKWEv64o8)
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/rufKWEv64o8/0.jpg)](https://www.youtube.com/watch?v=rufKWEv64o8)



## Usage

#### Create new wallet
![create new wallet](https://media.giphy.com/media/IeuEOtJvxCLqqiCCyr/giphy.gif)

Important! Be sure to backup your recovery seed phrase to restore your wallet later.

#### Send grin
![send grin](https://media.giphy.com/media/LO2sAR3HmocCdbTwEh/giphy.gif)

#### Receive grin
![receive grin](https://media.giphy.com/media/iFbSw9rhh5fGVSzyZf/giphy.gif)



## Compiling from source

### Dependencies
The following table summarizes the tools required to build. A few tools are included in this repository (marked as "Vendored").

| Dep          | Min. version  | Vendored | Debian/Ubuntu pkg    | name                                 | Optional | Purpose                |
| ------------ | ------------- | -------- | -------------------- | -------------------------------------| -------- | ---------------------- |
| npm          | ?             | NO       | `nmp`                | javascript package manager           | NO       | compiler               |
| grin         | current       | YES      |                      | grin node executable                 | NO       | grin node back-end     |
| grin-wallet  | current       | YES      |                      | grin-wallet executable               | NO       | grin-wallet back-end   |
| hedwig       | 1.0.0         | YES      |                      | public IP address relay service      | NO       | https relay service    |


*The current release is built on branch [gw3](https://github.com/grinfans/Niffler/tree/gw3)*


### Build instructions

Niffler Wallet uses the [npm build system](https://github.com/npm).

#### Linux
Install build dependencies on Debian/Ubuntu:

```bash
$ sudo apt update && sudo apt install npm
```


Cloning the repository
```bash
$ git clone https://github.com/grinfans/niffler.git && cd niffler
```


download and install dependencies with npm in the repository

```bash
npm install
cd hedwig
npm install
cd ..
```

Serve with hot reload at localhost:9080
```bash
npm run dev
```

Build electron application for production
```bash
npm run build
```

#### Installation directories 

##### Linux
/opt/Niffler

~/.niffler

~/.grin

##### Windows
c:\Program Files\Niffler

c:\user\username\\.niffler

c:\user\username\\.grin




## Credits 

We now have a wonderful logo <img src="/src/renderer/assets/logo.png" width="64"> from chinese grin community.

Logo made by [@Duoasa](https://weibo.com/u/3197271025), and also thanks [@机械师区块链](https://weibo.com/u/6318956004)

Thanks to  [@yozx](https://github.com/yozx) for Russian version.
