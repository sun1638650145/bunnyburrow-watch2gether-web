/**
 * 发送信息给WebSocket服务器.
 * @param {WebSocket} websocket - 一个websocket客户端链接.
 * @param {String|Object} data - 发送的数据: 播放/暂停操作, 修改播放倍速和播放进度.
 * @param {String} type - 发送的数据类型, command表示控制命令.
 */
export function sendMessage(websocket, data, type) {
    websocket.send(JSON.stringify({
        'data': data,
        'type': type
    }));

    if (type === 'command') {
        if (data === 'play') {
            console.log('客户端发送: 开始');
        } else if (data === 'pause') {
            console.log('客户端发送: 暂停');
        } else if (data.playbackRate) {
            console.log(`客户端发送: ${data.playbackRate}x 倍速`);
        } else if (data.newProgress) {
            console.log(`客户端发送: 更新进度到 ${data.newProgress.toFixed()} 秒`);
        }
    }
}
