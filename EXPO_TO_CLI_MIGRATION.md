# Expo 项目 CLI 打包方案

## 📋 当前情况

你的 Expo 项目位于：
```
/mnt/tfcard/.openclaw/tooldev-workspace/projects/memos-app
```

这个项目使用 Expo SDK 54，有完整的功能（导航、状态管理等）。

## 🎯 两种打包方案

### 方案 1：使用 EAS Build（推荐，Expo 官方）

**优点：**
- Expo 官方支持，稳定可靠
- 支持自动签名、云构建
- 可以生成 APK、AAB、IPA

**缺点：**
- 需要 Expo 账号
- 需要配置 EAS（免费额度有限）
- 云构建时间较长（5-15分钟）

### 方案 2：迁移到 CLI 项目（你已经有）

**优点：**
- 本地构建，完全控制
- 打包速度快（2-5分钟）
- 无需云服务依赖
- GitHub Actions 已配置

**缺点：**
- 需要手动迁移代码
- 失去 Expo Go 快速开发的优势

## 🔧 方案 2 详细步骤：迁移 Expo 到 CLI

我建议使用这个方案，因为你已经有 `/home/pi/MemosApp` 这个 CLI 项目了。

### 步骤 1：复制源代码

```bash
# 从 Expo 项目复制 App.js 和 src 目录
cp /mnt/tfcard/.openclaw/tooldev-workspace/projects/memos-app/App.js /home/pi/MemosApp/
cp -r /mnt/tfcard/.openclaw/tooldev-workspace/projects/memos-app/src /home/pi/MemosApp/

# 复制 assets（如果有图标、图片等）
cp -r /mnt/tfcard/.openclaw/tooldev-workspace/projects/memos-app/assets /home/pi/MemosApp/
```

### 步骤 2：安装 CLI 项目缺失的依赖

```bash
cd /home/pi/MemosApp

# 安装导航相关依赖
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# 安装状态管理
npm install zustand

# 安装其他依赖（根据需要）
npm install axios
```

### 步骤 3：修改配置

将 CLI 项目改为支持 Expo 风格开发：

1. 修改 `package.json` 添加 Metro 配置支持
2. 更新 `babel.config.js` 支持 Expo 插件
3. 适配导航和状态管理代码

### 步骤 4：打包

```bash
cd /home/pi/MemosApp/android
./gradlew assembleRelease
```

或推送 GitHub Actions 自动构建。

## 🚀 方案 1 快速开始：使用 EAS Build

如果你选择 EAS Build，只需：

```bash
cd /mnt/tfcard/.openclaw/tooldev-workspace/projects/memos-app

# 安装 EAS CLI
npm install -g eas-cli

# 登录 Expo
eas login

# 配置项目
eas build:configure

# 构建 APK
eas build --platform android --profile preview
```

## 💡 我的建议

**优先使用方案 2（迁移到 CLI）**，原因：

1. ✅ 你已经有现成的 CLI 项目和 GitHub Actions
2. ✅ 本地构建，速度更快
3. ✅ 完全控制构建流程
4. ✅ 不依赖云服务

我可以帮你自动完成迁移，需要我开始吗？
