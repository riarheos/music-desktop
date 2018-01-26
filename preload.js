const electron = require('electron');
const { ipcRenderer } = electron;

ipcRenderer.on('playpause', function(evt, args) {
    externalAPI.togglePause();
});

ipcRenderer.on('next', function(evt, args) {
    externalAPI.next();
});

ipcRenderer.on('prev', function(evt, args) {
    externalAPI.prev();
});
