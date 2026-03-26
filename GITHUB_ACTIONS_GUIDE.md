# GitHub Actions 打包 APK 指南

## 📋 前置条件

- GitHub 账号
- 项目已提交到 git（✅ 已完成）

## 🚀 使用步骤

### 1. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - Repository name: `MemosApp`
   - 设置为 Public 或 Private（Private 需要 GitHub Pro 或企业版才能使用 Actions）
   - 不要勾选 "Initialize with README"
3. 点击 "Create repository"

### 2. 连接本地仓库到 GitHub

```bash
cd /home/pi/MemosApp

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/MemosApp.git

# 推送代码到 GitHub
git push -u origin main
```

如果使用 SSH 密钥：
```bash
git remote add origin git@github.com:YOUR_USERNAME/MemosApp.git
git push -u origin main
```

### 3. 触发构建

推送代码后，GitHub Actions 会自动运行！

查看构建状态：
1. 访问你的 GitHub 仓库
2. 点击 "Actions" 标签
3. 查看 "Build Android APK" workflow 的运行状态

### 4. 下载 APK

**方式 1：从 Actions 下载**
1. 进入成功的 workflow run
2. 在 "Artifacts" 部分找到 `app-release`
3. 点击下载 ZIP 文件，解压即可获得 APK

**方式 2：从 Releases 下载**
1. 进入仓库的 "Releases" 标签
2. 下载最新发布的 APK

## ⚙️ 手动触发构建

如果不想每次 push 都构建，可以手动触发：

1. 进入仓库 "Actions" 标签
2. 选择 "Build Android APK"
3. 点击 "Run workflow"
4. 选择分支并点击 "Run workflow"

## 📱 安装 APK

将下载的 APK 传输到 Android 设备：

```bash
# 通过 ADB 安装
adb install app-release.apk

# 或直接在手机上打开 APK 文件安装
```

## 🔧 自定义配置

### 修改包名

编辑 `android/app/build.gradle`：
```gradle
android {
    defaultConfig {
        applicationId "com.yourcompany.memosapp"
        ...
    }
}
```

### 修改应用名称

编辑 `android/app/src/main/res/values/strings.xml`：
```xml
<string name="app_name">MemosApp</string>
```

### 修改图标

将你的应用图标放到：
```
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

## 📊 构建 URL

推送后，构建会自动开始，访问以下链接查看：

```
https://github.com/YOUR_USERNAME/MemosApp/actions
```

## ⚠️ 注意事项

1. **Private 仓库**：需要 GitHub Pro 或 Enterprise 才能使用 GitHub Actions
2. **首次构建**：首次运行可能需要 5-10 分钟（下载依赖）
3. **构建超时**：默认超时 6 小时，一般 APK 构建在 10-15 分钟内完成
4. **签名**：当前生成的 APK 是 debug/unsigned 签名，如需正式发布，需要配置签名

## 🔐 正式签名（可选）

如需发布到 Google Play，需要配置签名密钥：

1. 生成签名密钥：
```bash
keytool -genkey -v -keystore memosapp-release.keystore -alias memosapp -keyalg RSA -keysize 2048 -validity 10000
```

2. 在 GitHub Secrets 中添加：
   - `KEYSTORE_FILE`: Base64 编码的 keystore 文件
   - `KEYSTORE_PASSWORD`: Keystore 密码
   - `KEY_ALIAS`: Key alias
   - `KEY_PASSWORD`: Key 密码

3. 修改 workflow 使用签名配置

---

**有问题？** 查看构建日志了解详情！
