const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
	title: "Minecraft Locationer",
	createFile: (data) => ipcRenderer.invoke('create-file', data),
    getFile: () => ipcRenderer.invoke('get-file'),
	deleteFile: (title) => ipcRenderer.invoke('delete-file', title)
});