@echo off
chcp 65001 >nul
title 构建 Android APK
cd /d "%~dp0"
echo.
echo   ════════════════════════════════════
echo      📦 构建 Android APK
echo   ════════════════════════════════════
echo.
echo   前置条件：
echo   1. 已安装 Android Studio
echo   2. 已安装 Node.js
echo.
echo   正在构建...
call npm install
call npx cap sync
call npx cap add android
echo.
echo   请在 Android Studio 中打开 android/ 目录
echo   然后 Build → Build Bundle(s)/APK → Build APK(s)
echo.
echo   生成的 APK 位于:
echo   android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause
