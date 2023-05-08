/**
 * WebSocketClient类用于和WebSocket服务器进行通信,
 * 同步视频播放状态以及收发用户之间聊天内容.
 * @typedef {Object} Player
 */
export default class WebSocketClient {
    /**
     * 创建一个WebSocket客户端实例.
     * @param {string} url - WebSocket服务器的URL.
     * @constructor
     */
    constructor(url) {
        this.websocket = new WebSocket(url);
        this.websocket.onmessage = this.onMessage.bind(this);

        this.player = null;
    }

    /**
     * 初始化Video.js播放器.
     * @param {Player} player - Video.js播放器实例.
     */
    initPlayer(player) {
        this.player = player;
    }

    /**
     * 处理WebSocket服务器的消息.
     * @param {MessageEvent} event - WebSocket的onmessage事件对象.
     */
    onMessage(event) {
        const data = JSON.parse(event.data)['data'];
        const type = JSON.parse(event.data)['type'];

        if (this.player && type === 'command') { // 需要判断Video.js播放器是否初始化.
            // 处理控制命令.
            if (data === 'play') {
                this.player.play().then();
                console.log('收到服务器: 开始');
            } else if (data === 'pause') {
                this.player.pause();
                console.log('收到服务器: 暂停');
            } else if (data.playbackRate) {
                this.player.playbackRate(data.playbackRate);
                console.log(`收到服务器: ${data.playbackRate}x 倍速`);
            } else if (data.newProgress) {
                this.player.currentTime(data.newProgress);
                console.log(`收到服务器: 更新进度到 ${data.newProgress.toFixed()} 秒`);
            }
        } else if (type === 'chat') {
            // 显示聊天内容.
            console.log(`收到服务器: '${data}'.`);
        }
    }

    /**
     * 向WebSocket服务器发送消息.
     * @param {string|Object} data - 发送的数据.
     * @param {string} type - 数据类型.
     */
    sendMessage(data, type) {
        this.websocket.send(JSON.stringify({
            'data': data,
            'type': type
        }));

        if (type === 'command') {
            // 发送控制命令: 播放/暂停操作, 修改播放倍速和播放进度.
            if (data === 'play') {
                console.log('客户端发送: 开始');
            } else if (data === 'pause') {
                console.log('客户端发送: 暂停');
            } else if (data.playbackRate) {
                console.log(`客户端发送: ${data.playbackRate}x 倍速`);
            } else if (data.newProgress) {
                console.log(`客户端发送: 更新进度到 ${data.newProgress.toFixed()} 秒`);
            }
        } else if (type === 'chat') {
            // 发送聊天内容.
            console.log(`客户端发送: '${data}'.`);
        }
    }
}
