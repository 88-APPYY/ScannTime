# 进程监控器 - Windows 进程使用时长统计应用

一个基于 Electron + React 的暗色主题桌面应用，用于监控 Windows 进程使用时长，并以图表形式展示统计数据。

## 功能特性

- 🖥️ **进程监控**: 实时监控指定 Windows 进程（如 msedge.exe、vmware.exe 等）
- 📊 **数据统计**: 统计近7天或每日的进程使用时长
- 📈 **可视化图表**: 使用柱状图展示进程使用时长分布
- 📋 **进程列表**: 显示应用名、图标、使用时长和最后使用时间
- 🔄 **数据排序**: 支持按名称、使用时长、使用次数排序
- 💾 **数据持久化**: 使用 SQLite 存储历史数据
- 🎨 **暗色主题**: 现代化暗色界面设计
- 🔄 **自动刷新**: 每5秒自动更新进程状态

## 监控的进程

- Microsoft Edge (msedge.exe)
- Google Chrome (chrome.exe)
- Mozilla Firefox (firefox.exe)
- VMware (vmware.exe)
- Visual Studio Code (code.exe)
- 记事本 (notepad.exe)
- 文件资源管理器 (explorer.exe)

## 技术栈

- **前端**: React 18 + Recharts
- **后端**: Electron 28
- **数据库**: SQLite3
- **样式**: CSS3 + 暗色主题
- **工具**: date-fns、electron-store、electron-log

## 安装与运行

### 开发环境

1. 克隆项目并安装依赖：
```bash
cd electron-process-monitor
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

### 生产环境

1. 构建应用：
```bash
npm run build
npm run package
```

2. 安装包位于 `dist` 目录

## 项目结构

```
electron-process-monitor/
├── main.js              # Electron 主进程
├── preload.js           # 预加载脚本
├── database.js          # SQLite 数据库操作
├── processMonitor.js    # 进程监控逻辑
├── src/
│   ├── components/      # React 组件
│   │   ├── Header.js
│   │   ├── ProcessList.js
│   │   ├── ChartView.js
│   │   └── Footer.js
│   ├── styles/          # 样式文件
│   └── App.js           # 主应用组件
└── public/              # 静态资源
```

## 使用说明

1. **启动应用**: 应用启动后自动开始监控指定进程
2. **查看数据**: 
   - 顶部切换"每日统计"或"近7天统计"
   - 图表区域显示进程使用时长分布
   - 列表区域显示详细进程信息
3. **刷新数据**: 点击底部"刷新数据"按钮或等待自动刷新
4. **排序功能**: 点击列表表头进行排序

## 数据存储

- 数据存储在 `%APPDATA%/process-monitor.db`
- 包含进程启动时间、结束时间、持续时间
- 支持历史数据查询和统计

## 开发说明

### 添加新监控进程

在 `processMonitor.js` 的 `MONITORED_PROCESSES` 数组中添加新的进程名：
```javascript
const MONITORED_PROCESSES = [
  // ... 现有进程
  'your-process.exe'
];
```

### 自定义样式

- 主色调: `#4285f4` (蓝色)
- 背景色: `#121212` → `#1a1a1a` 渐变
- 文字色: `#e0e0e0`

## 注意事项

1. 需要管理员权限才能监控某些系统进程
2. 应用运行时会在后台持续监控进程
3. 数据每5秒自动保存到数据库
4. 支持 Windows 系统

## 许可证

MIT License
