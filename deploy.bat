@echo off
chcp 65001 >nul
echo ========================================
echo 汽车日志数据分析平台 - 部署脚本
echo ========================================
echo.

echo 正在检查文件完整性...
if not exist "index.html" (
    echo 错误: 找不到 index.html 文件
    pause
    exit /b 1
)

if not exist "script.js" (
    echo 错误: 找不到 script.js 文件
    pause
    exit /b 1
)

if not exist "config.js" (
    echo 错误: 找不到 config.js 文件
    pause
    exit /b 1
)

echo ✓ 所有必要文件已找到
echo.

echo 正在启动本地服务器...
echo 提示: 如果浏览器没有自动打开，请手动访问 http://localhost:8000
echo.

REM 尝试使用Python启动HTTP服务器
python -m http.server 8000 2>nul
if %errorlevel% neq 0 (
    echo Python HTTP服务器启动失败，尝试使用Node.js...
    npx http-server -p 8000 -o 2>nul
    if %errorlevel% neq 0 (
        echo 自动启动服务器失败
        echo 请手动执行以下命令之一：
        echo.
        echo Python 3: python -m http.server 8000
        echo Node.js: npx http-server -p 8000
        echo.
        echo 或者直接在浏览器中打开 index.html 文件
        pause
    )
)

echo.
echo 部署完成！
pause
