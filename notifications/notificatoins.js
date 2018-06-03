const { Notification, ipcMain, nativeImage, app} = require('electron')
const path = require('path');

function showNotifications() {
    let playing = false;

    ipcMain.on('state', (evt, state) => {
        playing = state;
    });

    ipcMain.on('track', (evt, track) => {
        if (!track) return;
        if (!playing) return;

        icon = nativeImage.createFromPath(path.join(app.getAppPath(), 'static/icon.png'))
        const n = new Notification({
            title: track.title,
            icon: icon,
            if (process.platform === 'darwin') {
                subtitle: track.artists[0].title,
            } else {
                body: track.artists[0].title,
            }
            silent: true,
        });
        n.show();
    });

}

module.exports = { showNotifications }
