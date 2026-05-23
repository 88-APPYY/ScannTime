import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/ChartView.css';

function ChartView({ data, viewMode, loading }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <div className="tooltip-header">
            <span className="process-name">{label}</span>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-item">
              <span className="tooltip-label">使用时长:</span>
              <span className="tooltip-value">{payload[0].value} 小时</span>
            </div>
            <div className="tooltip-item">
              <span className="tooltip-label">原始数据:</span>
              <span className="tooltip-value">
                {Math.round(payload[0].value * 3600)} 秒
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => {
    return (
      <div className="custom-legend">
        <div className="legend-title">
          <span className="legend-icon">📊</span>
          进程使用时长统计
        </div>
        <div className="legend-subtitle">
          {viewMode === 'daily' ? '今日使用情况' : '近7天使用情况'}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="chart-view loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载图表数据中...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-view empty">
        <div className="empty-state">
          <div className="empty-state-icon">📈</div>
          <p>暂无图表数据</p>
          <p className="text-muted">启动监控的进程后，图表将显示在这里</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-view">
      <div className="chart-header">
        <CustomLegend />
        <div className="chart-stats">
          <div className="stat-item">
            <div className="stat-label">总进程数</div>
            <div className="stat-value">{data.length}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">总时长</div>
            <div className="stat-value">
              {data.reduce((sum, item) => sum + item.duration, 0).toFixed(1)} 小时
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">最高使用</div>
            <div className="stat-value">
              {Math.max(...data.map(item => item.duration)).toFixed(1)} 小时
            </div>
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#404040" 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              stroke="#888"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#404040' }}
            />
            <YAxis 
              stroke="#888"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#404040' }}
              label={{ 
                value: '使用时长 (小时)', 
                angle: -90, 
                position: 'insideLeft',
                offset: 10,
                fill: '#888'
              }}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(66, 133, 244, 0.1)' }}
            />
            <Bar 
              dataKey="duration" 
              name="使用时长"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {data.map((entry, index) => (
                <rect 
                  key={`bar-${index}`}
                  fill={entry.color || '#4285f4'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-footer">
        <div className="color-legend">
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#4285f4' }}></span>
            <span className="color-label">浏览器</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#34a853' }}></span>
            <span className="color-label">开发工具</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#ff7139' }}></span>
            <span className="color-label">虚拟机</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#9c27b0' }}></span>
            <span className="color-label">其他</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartView;