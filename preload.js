const { ipcRenderer } = require('electron');

ipcRenderer.on('playpause', function(evt, args) {
    externalAPI.togglePause();
});

ipcRenderer.on('next', function(evt, args) {
    externalAPI.next();
});

ipcRenderer.on('prev', function(evt, args) {
    externalAPI.prev();
});

ipcRenderer.on('like', function(evt, args) {
    externalAPI.toggleLike();
    ipcRenderer.send('like', externalAPI.getCurrentTrack())
});

ipcRenderer.on('shuffle', function(evt, args) {
    externalAPI.toggleShuffle();
});

ipcRenderer.on('repeat', function(evt, args) {
    externalAPI.toggleRepeat();
});

function sendControls() {
    ipcRenderer.send('controls', externalAPI.getControls());
}

function sendTrack() {
    ipcRenderer.send('track', externalAPI.getCurrentTrack());
}

function sendState() {
    ipcRenderer.send('state', externalAPI.isPlaying());
}

function sendAll() {
    sendControls();
    sendTrack();
    sendState();
}

window.onload = () => {
    externalAPI.on(externalAPI.EVENT_CONTROLS, sendControls);
    externalAPI.on(externalAPI.EVENT_TRACK, sendTrack);
    externalAPI.on(externalAPI.EVENT_STATE, sendState);
    externalAPI.on(externalAPI.EVENT_READY, sendAll);
};
