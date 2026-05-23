const { exec } = require('child_process');
const { addProcessRecord } = require('./database');

// 监控的进程列表
const MONITORED_PROCESSES = [
  'msedge.exe',
  'chrome.exe',
  'firefox.exe',
  'vmware.exe',
  'code.exe',
  'notepad.exe',
  'explorer.exe'
];

// 存储进程状态
const processStates = new Map();

function monitorProcesses() {
  console.log('开始监控进程...');
  
  // 每5秒检查一次
  setInterval(() => {
    checkProcesses();
  }, 5000);
}

function checkProcesses() {
  exec('tasklist /FO CSV', (error, stdout, stderr) => {
    if (error) {
      console.error('获取进程列表失败:', error);
      return;
    }
    
    const processes = parseTasklistOutput(stdout);
    const currentTime = Date.now();
    
    // 检查每个监控的进程
    MONITORED_PROCESSES.forEach(processName => {
      const isRunning = processes.some(p => p.name.toLowerCase() === processName.toLowerCase());
      const processState = processStates.get(processName);
      
      if (isRunning) {
        // 进程正在运行
        if (!processState || !processState.isRunning) {
          // 进程刚刚启动
          processStates.set(processName, {
            isRunning: true,
            startTime: currentTime,
            lastCheck: currentTime
          });
          console.log(`进程启动: ${processName}`);
        } else {
          // 更新最后检查时间
          processStates.set(processName, {
            ...processState,
            lastCheck: currentTime
          });
        }
      } else {
        // 进程没有运行
        if (processState && processState.isRunning) {
          // 进程刚刚结束
          const duration = currentTime - processState.startTime;
          if (duration > 1000) { // 至少运行了1秒才记录
            addProcessRecord(processName, processState.startTime, currentTime);
            console.log(`进程结束: ${processName}, 持续时间: ${Math.floor(duration / 1000)}秒`);
          }
          processStates.set(processName, {
            isRunning: false,
            lastCheck: currentTime
          });
        }
      }
    });
    
    // 清理长时间未更新的状态
    const cleanupTime = currentTime - 30000; // 30秒前
    for (const [processName, state] of processStates.entries()) {
      if (state.isRunning && state.lastCheck < cleanupTime) {
        processStates.set(processName, {
          isRunning: false,
          lastCheck: currentTime
        });
      }
    }
  });
}

function parseTasklistOutput(output) {
  const lines = output.split('\n');
  const processes = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const parts = line.split('","');
      if (parts.length >= 1) {
        const name = parts[0].replace(/"/g, '');
        processes.push({ name });
      }
    }
  }
  
  return processes;
}

module.exports = {
  monitorProcesses,
  MONITORED_PROCESSES
};