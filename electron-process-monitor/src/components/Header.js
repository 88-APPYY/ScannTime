import React from 'react';
import '../styles/Header.css';

function Header({ viewMode, onViewModeChange, lastUpdated }) {
  const formatTime = (date) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    if (!date) return '--';
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">📊</span>
          <h1 className="logo-text">进程监控器</h1>
        </div>
        <div className="app-description">
          Windows 进程使用时长统计
        </div>
      </div>
      
      <div className="header-center">
        <div className="view-mode-selector">
          <button
            className={`view-mode-btn ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => onViewModeChange('daily')}
          >
            <span className="btn-icon">📅</span>
            每日统计
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'weekly' ? 'active' : ''}`}
            onClick={() => onViewModeChange('weekly')}
          >
            <span className="btn-icon">📈</span>
            近7天统计
          </button>
        </div>
      </div>
      
      <div className="header-right">
        <div className="last-updated">
          <div className="update-label">最后更新</div>
          <div className="update-time">
            <span className="time-icon">🕒</span>
            {formatTime(lastUpdated)}
          </div>
          <div className="update-date">
            {formatDate(lastUpdated)}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;