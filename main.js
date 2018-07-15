const path = require('path');
const tray = require('./tray');

const { app,
        BrowserWindow,
        globalShortcut } = require('electron');
const { embedTouchBar } = require('./touchbar.js');
const config = require('./config/config.js');
const { showNotifications } = require('./notifications/notificatoins.js');


app.on('ready', function() {
    const hideMenuBar = config.get("hideMenuBar", false);
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        title: 'Yandex.Music',
        autoHideMenuBar: hideMenuBar,
        icon: path.join(app.getAppPath(), 'static/icon.png'),
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    require("./menu/mainmenu.js");

    mainWindow.on('closed', function() {
        app.quit();
    });

	tray.create(mainWindow);

    mainWindow.loadURL('https://music.yandex.ru');

    showNotifications();

    if (process.platform === 'darwin') {
        embedTouchBar(mainWindow);
    }

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
