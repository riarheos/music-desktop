const { TouchBar, nativeImage, ipcMain } = require('electron');
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
        nativeImage.createFromPath('shuffle_white.png'),
        nativeImage.createFromPath('shuffle_black.png'),
    ];
    const shuffleButton = new TouchBarButton({
        icon: shuffleIcon[0],
        click: () => {
            mainWindow.webContents.send('shuffle');
        }
    });

    // bind to events
    ipcMain.on('controls', (evt, controls) => {
        prevButton.icon = prevIcon[ controls.prev ? 0 : 1 ];
        nextButton.icon = nextIcon[ controls.next ? 0 : 1 ];
        shuffleButton.icon = shuffleIcon[ controls.shuffle ? 0 : 1 ];
    });

    ipcMain.on('track', (evt, track) => {
    });

    ipcMain.on('state', (evt, state) => {
        if (state === true) {
            playButton.icon = pauseIcon[0];
        } else {
            playButton.icon = playIcon[0];
        }
    });

    // set the bar
    mainWindow.setTouchBar(new TouchBar([
        prevButton,
        playButton,
        nextButton,
        new TouchBarSpacer({size: 'small'}),
        shuffleButton,
    ]));
}

module.exports = { embedTouchBar };
