const path = require('path');
const { app,
        BrowserWindow,
        globalShortcut } = require('electron');
const { embedTouchBar } = require('./touchbar.js');
const { createMprisPlayer } = require('./player.js')
const config = require('./config/config.js');
const { showNotifications } = require('./notifications/notificatoins.js');
const { createTray } = require('./tray/tray.js')
let mainWindow = null;


const isSecondInstance = app.makeSingleInstance(() => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore()
        }
        mainWindow.focus()
    }
});

if (isSecondInstance) {
    app.quit()
}

app.on('ready', function () {
    const hideMenuBar = config.get("hideMenuBar", false);
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        center: true,
        show: false,
        backgroundColor: '#2e2c29',
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

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();

        if (process.platform === 'darwin') {
            embedTouchBar(mainWindow);
        }

        if (process.platform === 'linux') {
            createTray(mainWindow);
            createMprisPlayer(mainWindow);
        }
    });

    mainWindow.loadURL('https://music.yandex.ru');

    showNotifications();


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
