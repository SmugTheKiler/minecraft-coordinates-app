const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Use path.join to construct file paths for cross-platform compatibility
const locationsDir = path.join(__dirname, 'locations');

function createWindow() {
    const win = new BrowserWindow({
        width: 768,
        height: 560,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

// create location
ipcMain.handle('create-file', (event, data) => {
    if (!data || !data.title || !data.content) return false;
	const filePath = `./locations/${data.title}.txt`
	const directory = path.dirname(filePath);
    // Ensure directory exists, if not, create it
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    };
    try {
        fs.writeFileSync(filePath, data.content);
        return { success: true, filePath };
    } catch (error) {
        console.error('Error creating note:', error);
        return false;
    };
});

    // get locations
    ipcMain.handle('get-file', () => {
		const locationsDir = './locations';
		if (!fs.existsSync(locationsDir)) {
			fs.mkdirSync(locationsDir);
		};
		const files = fs.readdirSync(locationsDir);
		return files.map(file => {
			const filePath = `./locations/${file}`;
			const content = fs.readFileSync(filePath, 'utf8');
			return { title: path.basename(file, '.txt'), content };
		});		
    });

	ipcMain.handle('delete-file', (event, title) => {
		const filePath = path.join('locations', `${title}.txt`);
		try {
			fs.unlink(filePath, err => {
				if (err) {
				  throw err
				}
			  
				console.log('File is deleted.')
			  });
			console.log('File deleted successfully:', filePath);
			return { success: true }; // Return success status
		} catch (error) {
			console.error('Error deleting file:', error);
			return { success: false, error: error.message }; // Return error status
		}
	});

    win.loadFile('src/index.html');
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
