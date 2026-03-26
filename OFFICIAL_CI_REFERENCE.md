# React Native 官方CI模板参考

React Native 官方推荐使用这个模板：
https://github.com/react-native-community/cli/blob/main/packages/cli-platform-android/templates/boilerplate/.github/workflows/android.yml

关键配置：
1. 使用 node_modules 缓存
2. 使用 Gradle 缓存
3. 设置 JAVA_HOME
4. 使用适当的 JDK 版本

让我们参考这个模板来优化我们的workflow。
