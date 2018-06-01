const path = require('path');
const { TouchBar, nativeImage, ipcMain, Notification } = require('electron');
const { TouchBarLabel,
        TouchBarButton,
        TouchBarSpacer } = TouchBar;

function templateImage(name) {
    const imgNormal = nativeImage.createFromNamedImage(name);
    imgNormal.setTemplateImage(true);
    const imgDisabled = nativeImage.createFromNamedImage(name);
    return [imgNormal, imgDisabled];
}

function embedTouchBar(mainWindow) {
    let playing = false;

    // create the buttons
    const prevIcon = templateImage('NSTouchBarSkipBackTemplate');
    const prevButton = new TouchBarButton({
        icon: prevIcon[0],
        click: () => {
            mainWindow.webContents.send('prev');
        }
    });

    const nextIcon = templateImage('NSTouchBarSkipAheadTemplate');
    const nextButton = new TouchBarButton({
        icon: nextIcon[0],
        click: () => {
            mainWindow.webContents.send('next');
        }
    });

    const playIcon = templateImage('NSTouchBarPlayTemplate');
    const pauseIcon = templateImage('NSTouchBarPauseTemplate');
    const playButton = new TouchBarButton({
        icon: playIcon[0],
        click: () => {
            mainWindow.webContents.send('playpause');
        }
    });

    const shuffleIcon = [
        nativeImage.createFromPath(path.join(__dirname, 'shuffle_white.png')),
        nativeImage.createFromPath(path.join(__dirname, 'shuffle_black.png')),
    ];
    const shuffleButton = new TouchBarButton({
        icon: shuffleIcon[0],
        click: () => {
            mainWindow.webContents.send('shuffle');
        }
    });

    const repeatIcon = [
        nativeImage.createFromPath(path.join(__dirname, 'repeat_white.png')),
        nativeImage.createFromPath(path.join(__dirname, 'repeat_black.png')),
        nativeImage.createFromPath(path.join(__dirname, 'repeat_1.png')),
    ];
    const repeatButton = new TouchBarButton({
        icon: repeatIcon[0],
        click: () => {
            mainWindow.webContents.send('repeat');
        }
    });

    // bind to events
    ipcMain.on('controls', (evt, controls) => {
        prevButton.icon = prevIcon[ controls.prev ? 0 : 1 ];
        nextButton.icon = nextIcon[ controls.next ? 0 : 1 ];
        shuffleButton.icon = shuffleIcon[ controls.shuffle ? 0 : 1 ];
        repeatButton.icon = repeatIcon[ controls.repeat === 1
                                        ? 2
                                        : controls.repeat ? 0 : 1 ];
    });

    ipcMain.on('track', (evt, track) => {
        if (!track) return;
        if (!playing) return;

        const n = new Notification({
            title: track.title,
            subtitle: track.artists[0].title,
			body: track.artists[0].title,
            silent: true,
        });
        n.show()
    });

    ipcMain.on('state', (evt, state) => {
        if (state === true) {
            playButton.icon = pauseIcon[0];
        } else {
            playButton.icon = playIcon[0];
        }
        playing = state;
    });

    // set the bar
    mainWindow.setTouchBar(new TouchBar([
        prevButton,
        playButton,
        nextButton,
        new TouchBarSpacer({size: 'small'}),
        shuffleButton,
        repeatButton,
    ]));
}

module.exports = { embedTouchBar };
