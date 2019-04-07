import { app, BrowserWindow, dialog, shell } from 'electron'
const Menu = require('electron').Menu
const {ipcMain} = require('electron')

import checkUpdate from '../shared/updateChecker'
import {checkFirstTime} from '../shared/first'
checkFirstTime()

import log from '../shared/logger'
import {downloadUrl } from '../shared/config'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    title: 'Niffler Wallet',
    center: true,
    height: 480,
    useContentSize: true,
    width: 600,
    resizable:false,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  log.debug('Mainwindows created')
}

async function launch(){
  let toUpdate = await checkUpdate()
  if(toUpdate){
    dialog.showMessageBox({
      type: 'info',
      title: 'Found new version',
      buttons: ['Yes', 'No'],
      message: 'Found new version of Niffler wallet, go to download?',
    }, (res, checkboxChecked) => {
      if (res === 0) { 
        shell.openExternal(downloadUrl)
        app.quit()
      }else{
        createWindow()
        createMenu()
      }})
  }
} 

app.on('ready', ()=>{
  createWindow()
  createMenu()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', (event)=>{
  if(mainWindow){
  mainWindow.webContents.send('will-quit');
  setTimeout(()=>{
    app.quit()
  }, 500)
  log.debug('App will quit.')
}})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

ipcMain.on('resize', (event, width, height) => {
  mainWindow.setSize(width, height)
  mainWindow.center()
  log.debug(`mainWindow resized to ${width}:${height}`)
})

ipcMain.on('quit', (event) => {
  app.quit()
})

function createMenu() {
  const application = {
    label: "Application",
    submenu: [
      {
        label: "About Application",
        selector: "orderFrontStandardAboutPanel:"
      },
      {
        type: "separator"
      },
      {
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        selector: "undo:"
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        selector: "redo:"
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        selector: "cut:"
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        selector: "copy:"
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        selector: "paste:"
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: () => {
          app.quit()
        }
      }
    ]
  }

  const template = [
    application,
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}