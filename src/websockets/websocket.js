/**
 * 用户信息类型定义.
 * @typedef {Object} user 用户信息.
 * @property {string} avatar 头像的Base64.
 * @property {number} clientID 客户端ID.
 * @property {string} name 昵称.
 */

/**
 * WebSocket客户端.
 */
export default class WebSocketClient {
    /**
     * 实例化WebSocket客户端.
     * @param {string} url WebSocket服务地址.
     * @param {user} user 用户信息.
     * @constructor
     */
    constructor(url, user) {
        // 使用专属的WebSocket服务地址.
        this.socket = new WebSocket(url + user.clientID + '/');
        this.user = user;

        // 事件处理函数.
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onopen = this.onOpen.bind(this);

        // 事件监听对象.
        this.eventListeners = {};
    }

    /**
     * 向WebSocket服务器广播数据.
     * @param {Object} data 广播的数据.
     */
    broadcast(data) {
        this.socket.send(JSON.stringify({
            props: {type: 'websocket.broadcast'},
            data: data
        }));
    }

    /**
     * 断开与WebSocket服务器的连接.
     */
    close() {
        this.broadcast({
            action: 'connect',
            status: 'logout',
            user: {
                // 只发送客户端ID以减小网络开销.
                clientID: this.user.clientID
            }
        });

        this.socket.close();
    }

    /**
     * 触发事件监听函数.
     * @param {string} eventName 事件名称.
     * @param {...any} params 传递给监听函数的参数.
     */
    emit(eventName, ...params) {
        const listener = this.eventListeners[eventName];

        if (listener) {
            listener(...params);
        }
    }

    /**
     * 添加事件监听函数.
     * @param {string} eventName 事件名称.
     * @param {function} listener 监听函数.
     */
    on(eventName, listener) {
        this.eventListeners[eventName] = listener;
    }

    /**
     * 处理WebSocket服务器的消息.
     * @param {MessageEvent} event 接收到的消息事件.
     */
    onMessage(event) {
        const message = JSON.parse(event.data);
        const data = message.data;

        switch (data.action) {
        case 'chat':
            // 接收聊天消息.
            this.emit('receiveMessage', data.message, data.user.clientID);
            break;

        case 'connect':
            if (data.status === 'ack') {
                // 添加好友.
                this.emit('addFriend', data.user);
            } else if (data.status === 'login') {
                // 添加好友并同时回应自己的用户信息.
                this.emit('addFriend', data.user);
                this.unicast({
                    action: 'connect',
                    status: 'ack',
                    user: this.user
                }, data.user.clientID);
            } else if (data.status === 'logout') {
                // 移除好友.
                this.emit('removeFriend', data.user.clientID);
            }
            break;

        case 'player':
            // 接收播放器状态同步并显示视频播放器模态框.
            this.emit('receivePlayerSync', data.command);
            this.emit('showModal', data.command, data.user.clientID);
            break;

        default:
            break;
        }
    }

    /**
     * WebSocket连接成功后, 自动向服务器发送登录用户的信息.
     */
    onOpen() {
        this.broadcast({
            action: 'connect',
            status: 'login',
            user: this.user
        });
    }

    /**
     * 向WebSocket服务器连接的指定客户端单播数据.
     * @param {Object} data 单播的数据.
     * @param {number} receivedClientID 接收单播的客户端ID.
     */
    unicast(data, receivedClientID) {
        this.socket.send(JSON.stringify({
            props: {
                type: 'websocket.unicast',
                receivedClientID: receivedClientID
            },
            data: data
        }));
    }
}
