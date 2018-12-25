process.env.NODE_ENV = 'development'
require('electron-debug')({ showDevTools: false })
require('./main')