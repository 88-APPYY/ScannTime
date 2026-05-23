const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { format, subDays, startOfDay, endOfDay } = require('date-fns');

let db;

function initDatabase() {
  const dbPath = path.join(process.env.APPDATA || process.env.HOME, 'process-monitor.db');
  db = new sqlite3.Database(dbPath);
  
  db.serialize(() => {
    // 创建进程记录表
    db.run(`
      CREATE TABLE IF NOT EXISTS process_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        process_name TEXT NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        duration INTEGER, -- 持续时间（秒）
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建索引
    db.run('CREATE INDEX IF NOT EXISTS idx_process_name ON process_records(process_name)');
    db.run('CREATE INDEX IF NOT EXISTS idx_start_time ON process_records(start_time)');
    
    console.log('数据库初始化完成');
  });
}

function addProcessRecord(processName, startTime, endTime = null) {
  const duration = endTime ? Math.floor((endTime - startTime) / 1000) : null;
  
  db.run(
    'INSERT INTO process_records (process_name, start_time, end_time, duration) VALUES (?, ?, ?, ?)',
    [processName, new Date(startTime).toISOString(), endTime ? new Date(endTime).toISOString() : null, duration],
    (err) => {
      if (err) {
        console.error('添加进程记录失败:', err);
      }
    }
  );
}

function getProcessStats(days = 7) {
  return new Promise((resolve, reject) => {
    const startDate = subDays(new Date(), days);
    
    db.all(`
      SELECT 
        process_name,
        SUM(duration) as total_duration,
        COUNT(*) as usage_count,
        MAX(end_time) as last_used
      FROM process_records 
      WHERE start_time >= ? AND duration IS NOT NULL
      GROUP BY process_name
      ORDER BY total_duration DESC
    `, [startDate.toISOString()], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getDailyStats() {
  return new Promise((resolve, reject) => {
    const today = startOfDay(new Date());
    const tomorrow = endOfDay(new Date());
    
    db.all(`
      SELECT 
        strftime('%Y-%m-%d', start_time) as date,
        process_name,
        SUM(duration) as total_duration
      FROM process_records 
      WHERE start_time >= ? AND start_time <= ? AND duration IS NOT NULL
      GROUP BY date, process_name
      ORDER BY date DESC, total_duration DESC
    `, [today.toISOString(), tomorrow.toISOString()], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getWeeklyStats() {
  return new Promise((resolve, reject) => {
    const weekAgo = subDays(new Date(), 7);
    
    db.all(`
      SELECT 
        strftime('%Y-%m-%d', start_time) as date,
        process_name,
        SUM(duration) as total_duration
      FROM process_records 
      WHERE start_time >= ? AND duration IS NOT NULL
      GROUP BY date, process_name
      ORDER BY date DESC, total_duration DESC
    `, [weekAgo.toISOString()], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  initDatabase,
  addProcessRecord,
  getProcessStats,
  getDailyStats,
  getWeeklyStats
};