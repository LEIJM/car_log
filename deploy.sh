#!/bin/bash

echo "========================================"
echo "汽车日志数据分析平台 - 部署脚本"
echo "========================================"
echo

echo "正在检查文件完整性..."
if [ ! -f "index.html" ]; then
    echo "错误: 找不到 index.html 文件"
    exit 1
fi

if [ ! -f "script.js" ]; then
    echo "错误: 找不到 script.js 文件"
    exit 1
fi

if [ ! -f "config.js" ]; then
    echo "错误: 找不到 config.js 文件"
    exit 1
fi

echo "✓ 所有必要文件已找到"
echo

echo "正在启动本地服务器..."
echo "提示: 如果浏览器没有自动打开，请手动访问 http://localhost:8000"
echo

# 尝试使用Python启动HTTP服务器
if command -v python3 &> /dev/null; then
    echo "使用 Python 3 启动服务器..."
    python3 -m http.server 8000 &
    SERVER_PID=$!
elif command -v python &> /dev/null; then
    echo "使用 Python 启动服务器..."
    python -m http.server 8000 &
    SERVER_PID=$!
elif command -v node &> /dev/null; then
    echo "使用 Node.js 启动服务器..."
    npx http-server -p 8000 -o &
    SERVER_PID=$!
else
    echo "未找到可用的HTTP服务器"
    echo "请安装以下任一工具："
    echo "  - Python 3: sudo apt-get install python3 (Ubuntu/Debian)"
    echo "  - Python 3: brew install python3 (macOS)"
    echo "  - Node.js: https://nodejs.org/"
    echo
    echo "或者直接在浏览器中打开 index.html 文件"
    exit 1
fi

echo "服务器已启动，PID: $SERVER_PID"
echo "按 Ctrl+C 停止服务器"
echo

# 等待用户中断
trap "echo '正在停止服务器...'; kill $SERVER_PID 2>/dev/null; exit 0" INT
wait
