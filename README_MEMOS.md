# MemosApp - React Native 备忘录应用

一个简单但功能完整的备忘录应用，使用 React Native CLI 构建。

## 功能特性

- ✅ 创建备忘录
- ✅ 删除备忘录（带确认提示）
- ✅ 本地持久化存储（AsyncStorage）
- ✅ 深色/浅色模式自动适配
- ✅ 时间戳显示
- ✅ 空状态提示

## 技术栈

- React Native 0.84.1
- TypeScript
- AsyncStorage（数据持久化）
- React Hooks（useState, useEffect）

## 项目结构

```
MemosApp/
├── App.tsx              # 主应用组件
├── package.json          # 依赖配置
├── android/              # Android 原生代码
├── ios/                  # iOS 原生代码（仅 macOS）
└── node_modules/         # 依赖包
```

## 运行项目

### 前置条件

**Android：**
- JDK 11 或 17
- Android Studio
- Android SDK（API 33+）
- 模拟器或真机（开发者模式已开启）

**iOS（仅 macOS）：**
- Xcode（最新版本）
- CocoaPods

### 启动 Metro bundler

```bash
npm start
```

### 运行应用

**Android：**
```bash
npm run android
```

**iOS（仅 macOS）：**
```bash
npm run ios
```

## 应用使用说明

1. **添加备忘录**：在输入框中输入内容，点击"添加"按钮
2. **查看备忘录**：所有备忘录按创建时间倒序排列
3. **删除备忘录**：点击每条备忘录右侧的 🗑️ 图标，确认后删除
4. **深色模式**：系统会根据设备设置自动切换深色/浅色主题

## 数据存储

备忘录数据存储在设备本地，使用 AsyncStorage：
- 存储键：`@memos_app_data`
- 每条备忘录包含：id, text, createdAt

## 未来改进方向

- [ ] 添加编辑功能
- [ ] 支持分类/标签
- [ ] 搜索功能
- [ ] 备忘录置顶
- [ ] 导出功能
- [ ] 云同步

## 开发者

使用 React Native CLI 构建
Node.js: v24.14.0
