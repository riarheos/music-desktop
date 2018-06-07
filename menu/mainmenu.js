const { Menu, getCurrentWindow, app } = require('electron');
const config = require('../config/config.js');

function checkIfHidden() {
    hideMenuBar = config.get('hideMenuBar', false);
    return hideMenuBar;
}

function toggleHidden(isHidden) {
    config.set("hideMenuBar", isHidden ? false : true);
    app.relaunch();
    app.exit();
}

const template = [
    {
        label: 'View',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click(item, focusedWindow) {
                    if (focusedWindow) focusedWindow.reload()
                }
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                }
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() { require('electron').shell.openExternal('https://github.com/riarheos/music-desktop') }
            }
        ]
    }
]

if (process.platform === 'darwin') {
    const name = app.getName()
    template.unshift({
        label: name,
        submenu: [
            {
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    })
} else {
    template.unshift(
        {
            label: 'File',
            submenu: [
                {
                    role: 'quit'

                }
            ]
        },
        {
            label: 'Settings',
            submenu: [
                {
                    label: 'Autohide Menu Bar',
                    type: 'checkbox',
                    checked: checkIfHidden(),
                    click() {
                        toggleHidden(checkIfHidden());
                    }

                }
            ]

        }
    )
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
