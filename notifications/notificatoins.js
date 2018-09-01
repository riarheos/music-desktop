const { Notification, ipcMain, nativeImage, app} = require('electron')
const path = require('path');

function showNotifications() {
    let playing = false;

    ipcMain.on('state', (evt, state) => {
        playing = state;
    });

    ipcMain.on('like', (evt, track) => {
        if (track.liked) {
            icon = nativeImage.createFromPath(path.join(app.getAppPath(), 'static/yellow_heart.png'));
        } else {
            icon = nativeImage.createFromPath(path.join(app.getAppPath(), 'static/red_heart.png'));
        }

        const n = new Notification({
            title: track.title,
            silent: true,
            icon: process.platform === 'darwin' ? null : icon,
        });

        if (process.platform === 'darwin') {
            n.subtitle = track.artists[0].title;
        } else {
            n.body = track.artists[0].title;
        };

        n.show();
    });

    ipcMain.on('track', (evt, track) => {
        if (!track) return;
        if (!playing) return;

        icon = nativeImage.createFromPath(path.join(app.getAppPath(), 'static/icon.png'));
        const n = new Notification({
            title: track.title,
            silent: true,
            icon: process.platform === 'darwin' ? null : icon,
        });

        if (process.platform === 'darwin') {
            n.subtitle = track.artists[0].title;
        } else {
            n.body = track.artists[0].title;
        };

        n.show();
    });

}

module.exports = { showNotifications };
