/**
 * WebSocketClient类用于和WebSocket服务器进行通信,
 * 同步视频播放状态以及收发用户之间聊天内容.
 * @typedef {Object} Player
 */
export default class WebSocketClient {
    /**
     * 创建一个WebSocket客户端实例.
     * @param {string} url - WebSocket服务器的URL.
     * @param {Object} user - 当前登录用户的信息.
     * @constructor
     */
    constructor(url, user) {
        this.websocket = new WebSocket(url);
        this.websocket.onmessage = this.onMessage.bind(this);
        this.websocket.onopen = this.onOpen.bind(this);

        this.chatListHandler = null;
        this.modalMessageHandler = null;
        this.player = null;
        this.usersHandler = null;
        this.user = user;
    }

    /**
     * 断开与WebSocket服务器连接.
     */
    close() {
        // 与WebSocket服务器断开连接前, 广播用户退出消息.
        this.sendMessage({
            msg: 'logout',
            user: this.user
        }, {
            type: 'shake_hand'
        });

        this.websocket.close();
    }

    /**
     * 处理WebSocket服务器的消息.
     * @param {MessageEvent} event - WebSocket的onmessage事件对象.
     */
    onMessage(event) {
        const data = JSON.parse(event.data)['data'];
        const meta = JSON.parse(event.data)['meta'];

        if (this.player && meta.type === 'player_control') { // 判断播放器是否设置.
            // 处理控制命令.
            if (data.msg === 'play') {
                this.player.play().then();
                this.modalMessageHandler(`用户${data.user.name}播放了当前内容.`);

                console.log(`%c收到用户${data.user.name}: 开始`, 'color: red');
            } else if (data.msg === 'pause') {
                this.player.pause();
                this.modalMessageHandler(`用户${data.user.name}暂停了当前内容.`);

                console.log(`%c收到用户${data.user.name}: 暂停`, 'color: red');
            } else if (data.msg.playbackRate) {
                this.player.playbackRate(data.msg.playbackRate);
                this.modalMessageHandler(`用户${data.user.name}修改了播放速度.`);

                console.log(`%c收到用户${data.user.name}: ` +
                    `${data.msg.playbackRate}x 倍速`, 'color: red');
            } else if (data.msg.newProgress) {
                this.player.currentTime(data.msg.newProgress);
                this.modalMessageHandler(`用户${data.user.name}更新了播放进度.`);

                console.log(`%c收到用户${data.user.name}: ` +
                    `更新进度到 ${data.msg.newProgress.toFixed()} 秒`,
                'color: red');
            }
        } else if (this.chatListHandler && meta.type === 'chat_message') {
            // 显示聊天内容.
            this.chatListHandler(data);
            console.log(`%c收到用户${data.user.name}: '${data.msg}'.`,
                'color: blue');
        } else if (this.usersHandler && meta.type === 'shake_hand') {
            // 修改其他用户的信息.
            this.usersHandler(data);

            if (data.msg === 'login') {
                // 向其他用户回应自己的用户信息.
                this.sendMessage({
                    msg: 'ack',
                    user: this.user
                }, {
                    to: data.user.clientID, // 进行单播.
                    type: 'shake_hand'
                });

                console.log(`%c用户${data.user.name}登录.`, 'color: red');
            } else if (data.msg === 'logout') {
                console.log(`%c用户${data.user.name}退出.`, 'color: red');
            } else if (data.msg === 'ack') {
                console.log(`%c用户${data.user.name}已确认你的登录.`, 'color: red');
            }
        }
    }

    /**
     * 与WebSocket服务器连接成功后, 广播用户登录消息.
     */
    onOpen() {
        this.sendMessage({
            msg: 'login',
            user: this.user
        }, {
            type: 'shake_hand'
        });
    }

    /**
     * 向WebSocket服务器发送数据包.
     * @param {Object} data - 数据包中的数据(实际数据).
     * @param {Object} meta - 数据包总的元数据(包括类型, 形式等).
     */
    sendMessage(data, meta) {
        this.websocket.send(JSON.stringify({
            'data': data,
            'meta': meta
        }));

        if (meta.type === 'player_control') {
            // 发送控制命令: 播放/暂停操作, 修改播放倍速和播放进度.
            if (data.msg === 'play') {
                console.log('%c你发送: 开始', 'color: red');
            } else if (data.msg === 'pause') {
                console.log('%c你发送: 暂停', 'color: red');
            } else if (data.msg.playbackRate) {
                console.log('%c你发送: ' +
                    `${data.msg.playbackRate}x 倍速`, 'color: red');
            } else if (data.msg.newProgress) {
                console.log('%c你发送: ' +
                    `更新进度到 ${data.msg.newProgress.toFixed()} 秒`, 'color: red');
            }
        } else if (meta.type === 'chat_message') {
            // 发送聊天内容.
            console.log(`%c你发送: '${data.msg}'.`,
                'color: blue');
        } else if (meta.type === 'shake_hand') {
            // 广播用户登录消息.
            console.log('%c你广播你登录的消息', 'color: blue');
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
     * 设置更新全部登录用户列表处理函数.
     * @param {function} handler - 全部登录用户列表处理函数.
     */
    setUsersHandler(handler) {
        this.usersHandler = handler;
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
