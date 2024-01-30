import PropTypes from 'prop-types';
import React, {createContext, useState} from 'react';

import WebSocketClient from '../websockets/websocket.js';

/**
 * WebSocket服务Context值.
 * @typedef {Object} WebSocketContextValue.
 * @property {WebSocketClient} websocketClient WebSocket客户端实例.
 * @property {function} initWebSocket 初始化WebSocket客户端函数.
 * @property {string} websocketUrl WebSocket服务地址.
 * @property {function} handleWebSocketUrlChange 处理输入WebSocket服务地址函数.
 */

/**
 * WebSocket服务Context.
 * @type {React.Context<WebSocketContextValue>}
 */
export const WebSocketContext = createContext({});

/**
 * WebSocket服务Context的Provider.
 * @param {React.ReactNode} children 子组件.
 * @returns {React.ReactNode}
 * @constructor
 */
export function WebSocketProvider({children}) {
    // WebSocket客户端实例.
    const [websocketClient, setWebSocketClient] = useState(null);
    // WebSocket服务地址.
    const [websocketUrl, setWebSocketUrl] = useState('');

    /**
     * 处理输入WebSocket服务地址函数.
     * @param {React.ChangeEvent<HTMLInputElement>} e 输入框变化事件.
     */
    function handleWebSocketUrlChange(e) {
        setWebSocketUrl(e.target.value);
    }

    /**
     * 初始化WebSocket客户端函数.
     * @param {Object} user 用户信息.
     * @param {function} addFriend 向好友列表添加好友回调函数.
     * @param {function} removeFriend 从好友列表中移除指定客户端回调函数.
     */
    function initWebSocket(user, addFriend, removeFriend) {
        const client = new WebSocketClient(websocketUrl.trim(), user);

        client.on('addFriend', addFriend);
        client.on('removeFriend', removeFriend);

        setWebSocketClient(client);
    }

    return (
        <WebSocketContext.Provider
            value={{
                websocketClient,
                initWebSocket,
                websocketUrl,
                handleWebSocketUrlChange
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
}

WebSocketProvider.propTypes = {
    children: PropTypes.node
};
