import React from 'react';
import '../styles/Footer.css';

function Footer({ onRefresh, loading }) {
  const handleRefresh = () => {
    if (!loading) {
      onRefresh();
    }
  };

  const getMonitoredProcesses = () => {
    return [
      'Microsoft Edge (msedge.exe)',
      'Google Chrome (chrome.exe)',
      'Mozilla Firefox (firefox.exe)',
      'VMware (vmware.exe)',
      'Visual Studio Code (code.exe)',
      '记事本 (notepad.exe)',
      '文件资源管理器 (explorer.exe)'
    ];
  };

  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="monitored-processes">
          <div className="section-title">
            <span className="title-icon">👁️</span>
            监控的进程
          </div>
          <div className="process-tags">
            {getMonitoredProcesses().map((process, index) => (
              <span key={index} className="process-tag">
                {process}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="footer-center">
        <div className="app-info">
          <div className="info-item">
            <span className="info-icon">💾</span>
            <span className="info-text">数据存储: SQLite</span>
          </div>
          <div className="info-item">
            <span className="info-icon">📊</span>
            <span className="info-text">图表: Recharts</span>
          </div>
          <div className="info-item">
            <span className="info-icon">⚡</span>
            <span className="info-text">框架: Electron + React</span>
          </div>
        </div>
      </div>
      
      <div className="footer-right">
        <button 
          className={`refresh-btn ${loading ? 'loading' : ''}`}
          onClick={handleRefresh}
          disabled={loading}
        >
          <span className="btn-icon">
            {loading ? '⏳' : '🔄'}
          </span>
          {loading ? '刷新中...' : '刷新数据'}
        </button>
        
        <div className="footer-note">
          <span className="note-icon">ℹ️</span>
          数据每5秒自动更新，点击手动刷新
        </div>
      </div>
    </footer>
  );
}

export default Footer;