const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getProcessStats: (days) => ipcRenderer.invoke('get-process-stats', days),
  getDailyStats: () => ipcRenderer.invoke('get-daily-stats'),
  getWeeklyStats: () => ipcRenderer.invoke('get-weekly-stats'),
  refreshData: () => ipcRenderer.invoke('refresh-data'),
  getProcessIcon: (processName) => ipcRenderer.invoke('get-process-icon', processName),
  
  // 日志
  logInfo: (message) => console.log(message),
  logError: (message) => console.error(message)
});