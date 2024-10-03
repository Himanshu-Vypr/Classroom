// const { contextBridge, ipcRenderer } = require("electron");

// // Expose protected methods that allow the renderer process to interact with
// // the main process (via ipcRenderer) without exposing the entire electron API
// contextBridge.exposeInMainWorld("database", {
//   getUsers: async () => {
//     return await ipcRenderer.invoke("get-users");
//   },
// });

// console.log("Preload script loaded.");

const { contextBridge, ipcRenderer } = require("electron");

// Expose the "database" object in the renderer process
contextBridge.exposeInMainWorld("database", {
  getUsers: async () => await ipcRenderer.invoke("get-users"), // Securely invoke the IPC method
  addUser: async (name) => await ipcRenderer.invoke("add-user", name), // Expose addUser
  getClassrooms: async () => await ipcRenderer.invoke("get-classrooms"),
});

console.log("Preload script loaded.");
