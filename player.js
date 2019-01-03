const Player  = require('mpris-service');
const { app, ipcMain } = require('electron')

function createMprisPlayer(mainWindow) {
    let playing = false;

    const player = Player({
        name: 'yandexmusic',
        identity: 'Yandex Music',
        supportedInterfaces: ['player'],
    });

    player.metadata = {};

    player.playbackStatus = 'Stopped';
    function togglePlaystate(playing) {
        let b4 = player.playbackStatus;
        if ( playing === false ) {
            player.playbackStatus = "Paused";
        } else {
            player.playbackStatus = "Playing";
        }
        let after = player.playbackStatus;
        if ( b4 === after ) {
            return
        }

        player;
    }
    ipcMain.on('state', (evt, state) => {
        playing = state;
        togglePlaystate(playing);
    });

    ipcMain.on('track', (evt, track) => {
        if (!track) return;
        player.metadata = {
            'mpris:trackid': player.objectPath('track/0'),
            'mpris:artUrl': "https://" + track.cover.replace("%%", "200x200"),
            'xesam:title': track.title,
            'xesam:album': track.album.title,
            'xesam:artist': [track.artists[0].title]
        };
        console.log(track.cover.replace("%%", "200x200"))
        player;
    });

    player.on('next', function () {
        mainWindow.webContents.send("next");
    });

    player.on('previous', function () {
        mainWindow.webContents.send("prev");
    });

    player.on('playpause', function () {
        mainWindow.webContents.send("playpause");
    });

    player.on('quit', function () {
        app.quit()
    });
}

module.exports = { createMprisPlayer };
