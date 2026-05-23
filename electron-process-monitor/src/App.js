import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Header from './components/Header';
import ProcessList from './components/ProcessList';
import ChartView from './components/ChartView';
import Footer from './components/Footer';

function App() {
  const [viewMode, setViewMode] = useState('weekly'); // 'daily' 或 'weekly'
  const [processData, setProcessData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      let data;
      if (viewMode === 'daily') {
        data = await window.electronAPI.getDailyStats();
      } else {
        data = await window.electronAPI.getProcessStats(7);
      }
      
      // 处理数据
      const processedData = processRawData(data);
      setProcessData(processedData.processList);
      setChartData(processedData.chartData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const processRawData = (rawData) => {
    // 处理进程列表数据
    const processList = rawData.map(item => ({
      name: item.process_name,
      duration: item.total_duration || 0,
      usageCount: item.usage_count || 0,
      lastUsed: item.last_used ? new Date(item.last_used) : null,
      icon: getProcessIcon(item.process_name)
    })).sort((a, b) => b.duration - a.duration);

    // 处理图表数据
    const chartData = processList.slice(0, 10).map(item => ({
      name: item.name.replace('.exe', ''),
      duration: Math.round(item.duration / 3600 * 100) / 100, // 转换为小时
      color: getColorForProcess(item.name)
    }));

    return { processList, chartData };
  };

  const getProcessIcon = (processName) => {
    // 这里可以根据进程名返回对应的图标
    const icons = {
      'msedge.exe': '🌐',
      'chrome.exe': '🌐',
      'firefox.exe': '🦊',
      'vmware.exe': '🖥️',
      'code.exe': '💻',
      'notepad.exe': '📝',
      'explorer.exe': '📁'
    };
    return icons[processName] || '📄';
  };

  const getColorForProcess = (processName) => {
    const colors = {
      'msedge.exe': '#4285f4',
      'chrome.exe': '#34a853',
      'firefox.exe': '#ff7139',
      'vmware.exe': '#607d8b',
      'code.exe': '#007acc',
      'notepad.exe': '#2196f3',
      'explorer.exe': '#4caf50'
    };
    return colors[processName] || '#9c27b0';
  };

  useEffect(() => {
    fetchData();
  }, [viewMode]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="app-container">
      <Header 
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        lastUpdated={lastUpdated}
      />
      
      <main className="main-content">
        <div className="chart-section">
          <ChartView 
            data={chartData}
            viewMode={viewMode}
            loading={loading}
          />
        </div>
        
        <div className="list-section">
          <ProcessList 
            data={processData}
            loading={loading}
            onSort={(sortedData) => setProcessData(sortedData)}
          />
        </div>
      </main>
      
      <Footer 
        onRefresh={handleRefresh}
        loading={loading}
      />
    </div>
  );
}

export default App;