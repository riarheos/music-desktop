const path = require('path');
const tray = require('./tray');

const { app,
        BrowserWindow,
        globalShortcut } = require('electron');
const { embedTouchBar } = require('./touchbar.js');

app.on('ready', function() {
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        title: 'Yandex.Music',
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.on('closed', function() {
        app.quit();
    });

	tray.create(mainWindow);

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
