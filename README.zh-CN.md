# Niffler 钱包

简体中文 | [English](./README.md)

Niffler 是一个开箱即用、用户友好的 [Grin](https://github.com/mimblewimble/grin) 开源图形界面钱包.

遵循Grin的命名传统，钱包的名字 **Niffler** 也是来自["哈利波特"](https://harrypotter.fandom.com/wiki/Niffler).

#### 最新版本 V0.6.0

v0.6.0 支持Grin4(slatepack)

Mac/Windows/Linux 版本:
[https://github.com/grinfans/niffler/releases/tag/v0.6.0](https://github.com/grinfans/niffler/releases/tag/v0.6.0)

Niffler钱包 加了 **hedwig** v1 代理服务; 现在，没有公共ip的用户也可以很简单容易地接收grin了 :)

也就是说，**你现在可以非常容易从各大交易所或矿池 提取grin到你的本地钱包** 。

[A great video tutorial of how to withdraw grin from any exchanges using Niffler wallet.](https://www.youtube.com/watch?v=rufKWEv64o8)
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/rufKWEv64o8/0.jpg)](https://www.youtube.com/watch?v=rufKWEv64o8)

#### 中国大陆用户快速下载

中国大陆快速下载地址
>Mac:
https://grin-fans.oss-cn-hangzhou.aliyuncs.com/Niffler-v0.6.0-macos.dmg



>Windows:
https://grin-fans.oss-cn-hangzhou.aliyuncs.com/Niffler-v0.6.0-win-x64.exe



>Linux:
https://grin-fans.oss-cn-hangzhou.aliyuncs.com/Niffler-v0.6.0-linux-amd64.deb
https://grin-fans.oss-cn-hangzhou.aliyuncs.com/Niffler-v0.6.0-linux-amd64.AppImage


## 联系

联系我: xiaojay@gmail.com

Telegram group: https://t.me/nifflerwallet

客服qq： 1573479696

<img src="/src/renderer/assets/logo.png" width="256"> Logo 由[@Duoasa](https://weibo.com/u/3197271025)创建.

## 特点

* 用 [官方的Grin命令行钱包](https://github.com/mimblewimble/grin/releases) 作为后端, 用[elctron-vue](https://github.com/SimulatedGREG/electron-vue) 写了GUI界面

* 会支持多个平台(mac/linux/windows)

* 支持多个语言(目前支持[English](./README.md)和简体中文, 未来会更多)

## 运行

#### 新建钱包

![create new wallet](https://media.giphy.com/media/VDl8gkDBRjlLBTmE8J/giphy.gif)

#### 发送 grin

![send grin](https://media.giphy.com/media/kdo4hVj7G43yeUZKoQ/giphy.gif)

#### 接收 grin
![receive grin](https://media.giphy.com/media/j5ztcFxVGRtJncUolz/giphy.gif)


## 构建

*目前最新发布版本的Niffler 构建于分支 [gw3](https://github.com/grinfans/Niffler/tree/gw3)*


``` bash

# git 克隆 
git clone https://github.com/grinfans/niffler.git && cd niffler

# 安装依赖
npm install
cd hedwig
npm install


# 开发者模式
npm run dev

# 打包
npm run build
```

---

## 帮助

pull request 和 bug报告 当然非常欢迎.

~~更具体地说, 希望有grin社区的设计师帮助设计一个logo :-)~~

我们得到了中国grin社区的帮助，有了这个特别棒的logo <img src="/src/renderer/assets/logo.png" width="64"> :-).

[@Duoasa](https://weibo.com/u/3197271025) 设计了Logo, and 感谢 [@机械师区块链](https://weibo.com/u/6318956004) 牵线搭桥.

翻译到其他语言也是很需要的. 只要翻译下这个[语言文件夹](https://github.com/grinfans/niffler/tree/master/src/lang)里的文字即可.

感谢  [@yozx](https://github.com/yozx) 翻译俄语版本.
