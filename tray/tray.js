const { app,
        Menu,
        nativeImage,
        Tray } = require('electron');
const path = require('path');
let tray = null;

function createTray(mainWindow) {
    const icon = nativeImage.createFromPath(path.join(app.getAppPath(), 'static/icon.png'));
    const next = nativeImage.createFromPath(path.join(app.getAppPath(), 'static/next_track.png'));
    const prev = nativeImage.createFromPath(path.join(app.getAppPath(), 'static/prev_track.png'));
    const play = nativeImage.createFromPath(path.join(app.getAppPath(), 'static/play_track.png'));
    const heart = nativeImage.createFromPath(path.join(app.getAppPath(), 'static/heart.png'));

    tray = new Tray(icon.resize({
        height: 20,
    }));

    const activate = e => {
        mainWindow.webContents.send(e);
    }

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Play/Pause',
            icon: play,
            click() {
                activate('playpause')
            }
        },
        {
            label: 'Next',
            icon: next,
            click() {
                activate('next')
            }
        },
        {
            label: 'Prev',
            icon: prev,
            click() {
                activate('prev')
            }
        },
        {
            label: 'Like',
            icon: heart,
            click() {
                activate('like')
            }
        },
        { role: 'seperator' },
        {
            label: 'Show Window',
            click() {
                mainWindow.show();
            }

        },
        {
            label: 'Minimize',
            role: 'minimize'
        },
        { role: 'quit' }
    ])

    tray.setToolTip(app.getName());
    tray.setContextMenu(contextMenu)
}
module.exports = { createTray };