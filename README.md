# 📝 刷题小程序 — 全平台项目

支持 **Web · Android · iOS · 微信小程序** 四大平台。

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 本地预览 Web 版
npm start
```

## 📁 项目结构

```
quiz-app-public/
├── www/                    # Web 应用 (PWA)
│   ├── index.html          # 主应用 (移动端优化)
│   ├── download.html       # 下载/产品页面
│   ├── manifest.json       # PWA 配置
│   ├── sw.js               # Service Worker (离线支持)
│   └── icons/              # 应用图标
├── wechat/                 # 微信小程序
│   ├── app.js / .json / .wxss
│   └── pages/
├── android/                # Android 原生项目 (npx cap add android 后生成)
├── ios/                    # iOS 原生项目 (npx cap add ios 后生成)
├── capacitor.config.json   # Capacitor 配置
└── package.json
```

---

## 📱 一、上架 Google Play (Android)

### 前置条件
- Android Studio (免费下载)
- Google Play 开发者账号 ($25 一次性)

### 构建 APK

```bash
# 1. 添加 Android 平台
npx cap add android

# 2. 同步 Web 代码到原生项目
npx cap sync

# 3. 用 Android Studio 打开
npx cap open android

# 4. 在 Android Studio 中:
#    Build → Generate Signed Bundle/APK → APK → Release
#    创建签名密钥 (keystore)，保存好密码
```

### 上架步骤
1. 注册 [Google Play Console](https://play.google.com/console/)
2. 创建应用 → 填写名称/描述/截图
3. 上传 AAB 或 APK 文件
4. 填写隐私政策、内容分级
5. 提交审核 (通常 1-3 天)

---

## 🍎 二、上架 Apple App Store (iOS)

### 前置条件
- Mac 电脑 (必须)
- Xcode (免费)
- Apple Developer 账号 ($99/年)

### 构建 IPA

```bash
# 1. 添加 iOS 平台 (在 Mac 上)
npx cap add ios

# 2. 同步
npx cap sync

# 3. 用 Xcode 打开
npx cap open ios

# 4. 在 Xcode 中配置签名和证书
#    选择 Product → Archive → Distribute App
```

### 上架步骤
1. 注册 [App Store Connect](https://appstoreconnect.apple.com/)
2. 创建 App ID 和发布证书
3. 在 Xcode 中 Archive 并上传
4. 填写应用描述、截图、隐私政策
5. 提交审核 (通常 1-7 天)

---

## 💬 三、上架微信小程序

### 前置条件
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 微信小程序账号 (个人或企业)

### 注册小程序
1. 访问 [mp.weixin.qq.com](https://mp.weixin.qq.com/)
2. 点击「立即注册」→「小程序」
3. 填写信息 → 激活邮箱 → 实名认证
4. 获取 AppID

### 开发与提交
```bash
# 1. 打开微信开发者工具
# 2. 导入项目 → 选择 quiz-app-public/wechat 目录
# 3. 填入 AppID
# 4. 在工具中预览/调试
# 5. 点击「上传」提交代码
```

### 审核要点
- 小程序类目选择「教育→在线教育」或「工具→信息查询」
- 需要隐私政策页面
- 不能有外链 (微信内不能跳转外部网页)
- 功能完整、无 Bug

---

## 🌐 四、部署 Web 版 (公网访问)

### 方式 A：GitHub Pages (免费)

```bash
# 1. 创建 GitHub 仓库
# 2. 推送代码
git init
git add .
git commit -m "刷题小程序"
git remote add origin https://github.com/你的用户名/quiz-app.git
git push -u origin main

# 3. 在仓库 Settings → Pages → Source: GitHub Actions 或 main 分支
# 4. 访问 https://你的用户名.github.io/quiz-app/www/
```

### 方式 B：Vercel (免费，推荐)
```bash
npx vercel --prod
```

### 方式 C：自己的服务器
```bash
# 将 www/ 目录上传到服务器
# 用 nginx/apache 指向 www/ 目录即可
```

---

## ⚙️ 配置文件说明

| 文件 | 用途 |
|------|------|
| `package.json` | 项目依赖和脚本 |
| `capacitor.config.json` | App ID、包名、权限配置 |
| `www/manifest.json` | PWA 名称、图标、主题色 |
| `wechat/app.json` | 小程序页面路由、底部导航 |

### 修改包名/App名
1. `capacitor.config.json` → `appId` 改成你的包名
2. `www/manifest.json` → `name` 改成应用名
3. `wechat/app.json` → `navigationBarTitleText` 改标题

---

## 🔑 关键注意事项

- **数据存储**：Web 版用 localStorage，微信版用 wx.setStorageSync，原生版用 Capacitor Storage
- **隐私政策**：上架应用商店必须有隐私政策页面
- **图标**：需要 1024x1024 的应用图标 (已生成在 `www/icons/`)
- **签名**：Android 需要 keystore 签名，iOS 需要开发者证书
- **审核**：应用商店审核主要看功能完整性、UI 质量、隐私合规

---

## 📊 当前状态

| 平台 | 状态 | 下一步 |
|------|------|--------|
| 🌐 Web PWA | ✅ 完成 | 部署到 GitHub Pages |
| 🤖 Android | 📦 项目就绪 | 需要 Android Studio 构建 |
| 🍎 iOS | 📦 项目就绪 | 需要 Mac + Xcode |
| 💬 微信小程序 | 🏗️ 框架完成 | 需要完善页面，微信开发者工具调试 |
