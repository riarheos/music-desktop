const path = require('path');
const { app,
        BrowserWindow,
        globalShortcut } = require('electron');
const { embedTouchBar } = require('./touchbar.js');
const config = require('./config/config.js');


app.on('ready', function() {
    const hideMenuBar = config.get("hideMenuBar", false);
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        title: 'Yandex.Music',
        autoHideMenuBar: hideMenuBar,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    require("./menu/mainmenu.js");

    mainWindow.on('closed', function() {
        app.quit();
    });

    mainWindow.loadURL('https://music.yandex.ru');
    embedTouchBar(mainWindow);

    globalShortcut.register('mediaplaypause', function() {
        mainWindow.webContents.send('playpause');
    });

    globalShortcut.register('medianexttrack', function() {
        mainWindow.webContents.send('next');
    });

    globalShortcut.register('mediaprevioustrack', function() {
        mainWindow.webContents.send('prev');
    });
});
