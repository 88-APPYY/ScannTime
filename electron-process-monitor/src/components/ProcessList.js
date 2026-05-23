import React, { useState } from 'react';
import '../styles/ProcessList.css';

function ProcessList({ data, loading, onSort }) {
  const [sortBy, setSortBy] = useState('duration'); // 'duration', 'name', 'usage'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  const formatDuration = (seconds) => {
    if (!seconds) return '0秒';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}小时${minutes}分`;
    } else if (minutes > 0) {
      return `${minutes}分${secs}秒`;
    } else {
      return `${secs}秒`;
    }
  };

  const formatLastUsed = (date) => {
    if (!date) return '从未使用';
    
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return '刚刚';
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}天前`;
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    
    const sortedData = [...data].sort((a, b) => {
      let aValue, bValue;
      
      switch (field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'usage':
          aValue = a.usageCount || 0;
          bValue = b.usageCount || 0;
          break;
        case 'duration':
        default:
          aValue = a.duration || 0;
          bValue = b.duration || 0;
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    onSort(sortedData);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '⬆️' : '⬇️';
  };

  if (loading) {
    return (
      <div className="process-list loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载进程数据中...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="process-list empty">
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>暂无进程数据</p>
          <p className="text-muted">启动监控的进程后，数据将显示在这里</p>
        </div>
      </div>
    );
  }

  return (
    <div className="process-list">
      <div className="list-header">
        <h2 className="list-title">
          <span className="title-icon">📋</span>
          进程列表
        </h2>
        <div className="list-count">
          共 {data.length} 个进程
        </div>
      </div>
      
      <div className="sort-controls">
        <button 
          className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
          onClick={() => handleSort('name')}
        >
          应用名 {getSortIcon('name')}
        </button>
        <button 
          className={`sort-btn ${sortBy === 'duration' ? 'active' : ''}`}
          onClick={() => handleSort('duration')}
        >
          使用时长 {getSortIcon('duration')}
        </button>
        <button 
          className={`sort-btn ${sortBy === 'usage' ? 'active' : ''}`}
          onClick={() => handleSort('usage')}
        >
          使用次数 {getSortIcon('usage')}
        </button>
      </div>
      
      <div className="process-items">
        {data.map((process, index) => (
          <div key={index} className="process-item hover-card">
            <div className="process-icon">
              <span className="icon">{process.icon}</span>
            </div>
            
            <div className="process-info">
              <div className="process-name">
                {process.name.replace('.exe', '')}
                <span className="process-extension">.exe</span>
              </div>
              <div className="process-meta">
                <span className="meta-item">
                  <span className="meta-icon">🔄</span>
                  {process.usageCount || 0} 次
                </span>
                <span className="meta-item">
                  <span className="meta-icon">⏰</span>
                  {formatLastUsed(process.lastUsed)}
                </span>
              </div>
            </div>
            
            <div className="process-duration">
              <div className="duration-value">
                {formatDuration(process.duration)}
              </div>
              <div className="duration-bar">
                <div 
                  className="duration-fill"
                  style={{
                    width: `${Math.min(100, (process.duration / 3600) * 5)}%`,
                    backgroundColor: getDurationColor(process.duration)
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getDurationColor(duration) {
  const hours = duration / 3600;
  
  if (hours < 1) return '#4caf50'; // 绿色
  if (hours < 3) return '#ff9800'; // 橙色
  if (hours < 8) return '#f44336'; // 红色
  return '#9c27b0'; // 紫色
}

export default ProcessList;