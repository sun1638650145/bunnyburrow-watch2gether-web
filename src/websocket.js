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

        this.chatListHandler = null;
        this.modalMessageHandler = null;
        this.player = null;
    }

    /**
     * 处理WebSocket服务器的消息.
     * @param {MessageEvent} event - WebSocket的onmessage事件对象.
     */
    onMessage(event) {
        const data = JSON.parse(event.data)['data'];
        const type = JSON.parse(event.data)['type'];

        if (this.player && type === 'command') { // 判断Video.js播放器是否设置.
            // 处理控制命令.
            if (data.command === 'play') {
                this.player.play().then();
                this.modalMessageHandler(`用户${data.user.name}播放了当前内容.`);

                console.log(`%c收到用户${data.user.name}: 开始`, 'color: red');
            } else if (data.command === 'pause') {
                this.player.pause();
                this.modalMessageHandler(`用户${data.user.name}暂停了当前内容.`);

                console.log(`%c收到用户${data.user.name}: 暂停`, 'color: red');
            } else if (data.command.playbackRate) {
                this.player.playbackRate(data.command.playbackRate);
                this.modalMessageHandler(`用户${data.user.name}修改了播放速度.`);

                console.log(`%c收到用户${data.user.name}: ` +
                    `${data.command.playbackRate}x 倍速`, 'color: red');
            } else if (data.command.newProgress) {
                this.player.currentTime(data.command.newProgress);
                this.modalMessageHandler(`用户${data.user.name}更新了播放进度.`);

                console.log(`%c收到用户${data.user.name}: ` +
                    `更新进度到 ${data.command.newProgress.toFixed()} 秒`,
                'color: red');
            }
        } else if (this.chatListHandler && type === 'chat') { // 判断聊天内容处理函数是否设置.
            // 显示聊天内容.
            this.chatListHandler(data);
            console.log(`%c收到用户${data.user.name}: '${data.content}'.`,
                'color: blue');
        }
    }

    /**
     * 向WebSocket服务器发送消息.
     * @param {Object} data - 发送的数据.
     * @param {string} type - 数据类型.
     */
    sendMessage(data, type) {
        this.websocket.send(JSON.stringify({
            'data': data,
            'type': type
        }));

        if (type === 'command') {
            // 发送控制命令: 播放/暂停操作, 修改播放倍速和播放进度.
            if (data.command === 'play') {
                console.log(`%c用户${data.user.name}发送: 开始`, 'color: red');
            } else if (data.command === 'pause') {
                console.log(`%c用户${data.user.name}发送: 暂停`, 'color: red');
            } else if (data.command.playbackRate) {
                console.log(`%c用户${data.user.name}发送: ` +
                    `${data.command.playbackRate}x 倍速`, 'color: red');
            } else if (data.command.newProgress) {
                console.log(`%c用户${data.user.name}发送: ` +
                    `更新进度到 ${data.command.newProgress.toFixed()} 秒`,
                'color: red');
            }
        } else if (type === 'chat') {
            // 发送聊天内容.
            console.log(`%c用户${data.user.name}发送: '${data.content}'.`,
                'color: blue');
        }
    }

    /**
     * 设置更新聊天内容处理函数.
     * @param {function} handler - 聊天内容处理函数.
     */
    setChatListHandler(handler) {
        this.chatListHandler = handler;
    }

    /**
     * 设置播放器模态框内容处理函数.
     * @param {function} handler - 播放器模态框内容处理函数.
     */
    setVideoPlayerModalMessageHandler(handler) {
        this.modalMessageHandler = handler;
    }

    /**
     * 设置Video.js播放器.
     * @param {Player} player - Video.js播放器实例.
     */
    setPlayer(player) {
        this.player = player;
    }
}
