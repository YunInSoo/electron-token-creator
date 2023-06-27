// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myAPI", {
  getHash: async (input) => ipcRenderer.invoke("getHash", input),
});
