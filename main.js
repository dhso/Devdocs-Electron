const path = require('path')
const { app, BrowserWindow, Menu, shell } = require('electron')
const { isDarwin, isLinux, isWindows } = require('./utils')
const config = require('./config')
const { appMenu, contextMenu } = require('./menu')

app.setAppUserModelId('com.minws.devdoc')
app.commandLine.appendSwitch('ignore-certificate-errors')

const mainURL = 'http://devdocs.io'
let mainWindow
let isQuitting = false

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
  process.exit()
}

if (mainWindow) {
  if (mainWindow.isMinimized()) { mainWindow.restore() }
  if (!mainWindow.isVisible()) { mainWindow.show() }
  mainWindow.focus()
}

function createMainWindow() {
  const windowState = config.get('windowState')

  const win = new BrowserWindow({
    show: false, // Hide application until your page has loaded
    title: app.getName(),
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    minWidth: config.get('minWidth'),
    minHeight: config.get('minHeight'),
    // titleBarStyle: 'hiddenInset',
    alwaysOnTop: config.get('alwaysOnTop'),
    autoHideMenuBar: config.get('autoHideMenuBar'),
    backgroundColor: '#f2f2f2',
    icon: path.join(__dirname, 'icons/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'renderer.js'),
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  })

  if (isDarwin) { win.setSheetOffset(40) }

  win.loadURL(mainURL)

  win.once('ready-to-show', () => { win.show() })

  win.webContents.on('context-menu', (e) => {
    contextMenu.popup()
  })

  win.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault()
      isDarwin ? app.hide() : win.hide()
    }
  })

  return win
}

app.on('ready', () => {
  Menu.setApplicationMenu(appMenu)
  const { webContents } = mainWindow = createMainWindow()
  webContents.on('dom-ready', () => {
    // webContents.insertCSS(fs.readFileSync(path.join(__dirname, './index.css'), 'utf8'))
  })
  webContents.on('new-window', (e, url) => {
    e.preventDefault()
    shell.openExternal(url)
  })
})

app.on('activate', () => { mainWindow.show() })

app.on('before-quit', () => {
  isQuitting = true
  if (!mainWindow.isFullScreen()) { config.set('windowState', mainWindow.getBounds()) }
})

app.on('ready', () => {})