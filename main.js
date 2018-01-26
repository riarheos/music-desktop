const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

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

    mainWindow.loadURL('https://music.yandex.ru');

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
