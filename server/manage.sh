#!/bin/bash
# 洁雅股份网站 - 生产服务器管理脚本
# 用法: ./server/manage.sh {start|stop|restart|status}

DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$DIR/server/.prod.pid"
LOG_FILE="$DIR/server/prod.log"

case "$1" in
  start)
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "⚠  服务器已在运行 (PID: $(cat $PID_FILE))"
      exit 1
    fi
    echo "🚀 启动洁雅股份生产服务器..."
    cd "$DIR"
    nohup node server/prod.js > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    sleep 2
    if kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "✅ 服务器已启动 (PID: $(cat $PID_FILE))"
      echo "🌐  http://localhost:3000"
    else
      echo "❌ 启动失败，查看日志: tail -20 $LOG_FILE"
      exit 1
    fi
    ;;
  stop)
    if [ ! -f "$PID_FILE" ]; then
      echo "⚠  未找到 PID 文件，尝试 pkill..."
      pkill -f "node server/prod.js" 2>/dev/null && echo "✅ 已停止" || echo "⚠  未找到进程"
      exit 0
    fi
    PID=$(cat "$PID_FILE")
    kill $PID 2>/dev/null && echo "✅ 服务器已停止 (PID: $PID)" || echo "⚠  进程不存在"
    rm -f "$PID_FILE"
    ;;
  restart)
    $0 stop
    sleep 1
    $0 start
    ;;
  status)
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "✅ 服务器运行中 (PID: $(cat $PID_FILE))"
      echo "🌐  http://localhost:3000"
    else
      echo "❌ 服务器未运行"
      exit 1
    fi
    ;;
  *)
    echo "用法: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
