'use strict';
const path     = require('path');
const electron = require('electron');

const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;
let tray            = null;

function activate(command) {
	const appWindow = BrowserWindow.getAllWindows()[0];
	// Extra measure in order to be shown
	//appWindow.show();
	appWindow.webContents.send(command);
}

exports.create = win => {
	if (process.platform === 'darwin' || tray) {
		return;
	}

	const iconPath = path.join(__dirname, 'icon.png');

	const toggleWin   = () => {
		// Toggle/untoggle window
		if (win.isVisible()) {
			win.hide();
		} else {
			win.show();
		}
	};
	const contextMenu = electron.Menu.buildFromTemplate([
		{
			label: 'Play/Pause',
			click() {
				activate('playpause');
			}
		},
		{
			label: 'Next',
			click() {
				activate('next');
			}
		},
		{
			label: 'Prev',
			click() {
				activate('prev');
			}
		}, {
			type: 'separator'
		},
		{
			type: 'separator'
		}, {
			role: 'quit'
		}
	]);

	tray = new electron.Tray(iconPath);
	tray.setToolTip(`${app.getName()}`);
	tray.setContextMenu(contextMenu);
	tray.on('click', toggleWin);

	electron.ipcMain.on('track', function (e, track) {
		if (track) {
			tray.setToolTip('Playing ' + track.title + ' ' + track.artists[0].title);
		}
	})
};