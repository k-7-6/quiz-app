@echo off
chcp 65001 >nul
title 部署刷题小程序到 GitHub
cd /d "%~dp0"

echo.
echo   ══════════════════════════════════════════
echo      📝 刷题小程序 - 一键部署到 GitHub
echo   ══════════════════════════════════════════
echo.
echo   请先在浏览器中完成以下操作：
echo   1. 打开 https://github.com/new
echo   2. Repository name 填写: quiz-app
echo   3. 选择 Public（公开）
echo   4. 不要勾选任何初始化选项
echo   5. 点击 Create repository
echo.
echo   然后复制仓库地址，例如：
echo   https://github.com/你的用户名/quiz-app.git
echo.
echo   ══════════════════════════════════════════
echo.

set /p REPO_URL="请输入仓库地址: "

echo.
echo   正在推送代码...

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo   ✅ 推送成功！
    echo.
    echo   下一步：开启 GitHub Pages
    echo   1. 打开 %REPO_URL:~0,-4%/settings/pages
    echo   2. Source 选择 "Deploy from a branch"
    echo   3. Branch 选择 "main" 和 "/ (root)"
    echo   4. 点击 Save
    echo   5. 等待1-2分钟，访问：
    echo      https://你的用户名.github.io/quiz-app/www/
    echo.
) else (
    echo.
    echo   ❌ 推送失败，请检查：
    echo   - 仓库地址是否正确
    echo   - 是否已经创建了仓库
    echo   - 网络连接是否正常
    echo.
    echo   如果弹出了GitHub登录窗口，请登录后重试。
    echo.
)

pause
