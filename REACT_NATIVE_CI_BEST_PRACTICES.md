# React Native GitHub Actions 最佳实践参考

## 📚 参考资源

### 官方文档
- React Native 官方文档：https://reactnative.dev/docs/0.73/set-up-ci
- GitHub Actions 文档：https://docs.github.com/en/actions

### 社区示例
- React Native CI 示例（社区维护）
- Expo EAS Build（推荐用于生产）

## 🔧 已知的稳定配置

### 工作配置
| 工具 | 推荐版本 | 说明 |
|------|-----------|------|
| Node.js | 18.x 或 20.x | 稳定版本，避免最新版问题 |
| JDK | 17 | Temurin 发行版 |
| Gradle | 最新稳定版 | 通过 wrapper 管理 |
| NDK | r26b | 或按项目要求 |

### 关键配置点

#### 1. Gradle Properties
```properties
# android/gradle.properties
newArchEnabled=false
hermesEnabled=true
android.useAndroidX=true
```

#### 2. Node.js 缓存
```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

#### 3. Gradle 缓存
```yaml
- name: Cache Gradle
  uses: actions/cache@v4
  with:
    path: |
      ~/.gradle/caches
      ~/.gradle/wrapper
    key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
```

#### 4. APK 签名配置
**调试/开发构建：**
```properties
# android/gradle.properties
MYAPP_RELEASE_STORE_FILE=debug.keystore
MYAPP_RELEASE_KEY_ALIAS=androiddebugkey
MYAPP_RELEASE_STORE_PASSWORD=android
MYAPP_RELEASE_KEY_PASSWORD=android
```

**生产构建：**
需要在 GitHub Secrets 中添加：
- KEYSTORE_FILE (base64)
- KEYSTORE_PASSWORD
- KEY_ALIAS
- KEY_PASSWORD

## 🎯 成功的社区示例

### 示例 1：React Native CLI 简化构建
```yaml
name: React Native Android Build

on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Setup Android SDK
        run: |
          sudo apt-get update
          sudo apt-get -y install sdkmanager

      - name: Install dependencies
        run: npm ci

      - name: Build Android
        run: |
          cd android
          chmod +x gradlew
          ./gradlew assembleRelease

      - uses: actions/upload-artifact@v4
        with:
          name: apk
          path: android/app/build/outputs/apk/release/*.apk
```

### 示例 2：使用 prebuild（推荐）

对于需要 Expo 特性但想要原生构建的项目：

```bash
# 本地
npx expo prebuild --clean

# GitHub Actions
- name: Prebuild
  run: npx expo prebuild --clean

- name: Build APK
  run: cd android && ./gradlew assembleRelease
```

## 💡 故障排除

### 常见错误

#### 1. "SDK location not found"
**原因：** 未配置 Android SDK 路径

**解决：**
```yaml
- name: Set up Android SDK
  run: |
    echo "sdk.dir=$ANDROID_HOME" >> local.properties
```

#### 2. "Could not resolve dependency"
**原因：** npm 缓存或依赖冲突

**解决：**
```yaml
- name: Clean install
  run: |
    rm -rf node_modules package-lock.json
    npm install
```

#### 3. Build takes too long
**原因：** 每次都下载依赖

**解决：**
- 启用缓存（见上文配置）
- 使用 `--offline` 模式

#### 4. "newArchEnabled causes build failure"
**原因：** 新架构配置不正确

**解决：**
```bash
# 在 android/gradle.properties 中
newArchEnabled=false
```

## 📋 推荐的工作流

### 选项 1：React Native CLI + Expo Prebuild（推荐）

结合两者优势：
- 使用 Expo 的开发体验
- 使用原生构建的灵活性
- 不需要云服务

**步骤：**
1. 安装 expo-cli
2. 运行 `npx expo prebuild --clean`
3. 使用 Gradle 构建 APK

### 选项 2：完全 Expo EAS Build（最稳定）

适用于生产环境：
- 云构建，无需维护 CI 服务器
- 自动签名和分发
- 支持多个平台

**步骤：**
1. 配置 eas.json
2. 运行 `eas build --platform android`
3. 使用 GitHub Actions 触发

### 选项 3：第三方 CI 服务

如果 GitHub Actions 持续失败：
- CircleCI
- Bitrise
- Appcenter

## 🔗 有用的链接

- React Native CI 官方文档
- GitHub Actions 文档
- Expo EAS Build 文档
- React Native GitHub Actions 示例搜索
