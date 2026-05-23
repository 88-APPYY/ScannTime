const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initDatabase, getProcessStats, getDailyStats, getWeeklyStats, addProcessRecord } = require('./database');
const { monitorProcesses } = require('./processMonitor');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'build', 'favicon.ico'),
    title: '进程监控器',
    backgroundColor: '#1a1a1a'
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // 初始化数据库
  initDatabase();
  
  // 启动进程监控
  monitorProcesses();
  
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC 通信处理
ipcMain.handle('get-process-stats', async (event, days = 7) => {
  return getProcessStats(days);
});

ipcMain.handle('get-daily-stats', async () => {
  return getDailyStats();
});

ipcMain.handle('get-weekly-stats', async () => {
  return getWeeklyStats();
});

ipcMain.handle('refresh-data', async () => {
  return getProcessStats(7);
});

ipcMain.handle('get-process-icon', async (event, processName) => {
  // 这里可以添加获取进程图标的逻辑
  return null;
});