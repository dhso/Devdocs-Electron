const electron = require('electron')
const { ipcRenderer } = electron

ipcRenderer.on('show:preferences', () => {
  if (document.querySelector('[href="/settings"]')) document.querySelector('[href="/settings"]').click()
})

ipcRenderer.on('show:offine', () => {
  if (document.querySelector('[href="/offline"]')) document.querySelector('[href="/offline"]').click()
})