import PropTypes from 'prop-types';
import React, {useState} from 'react';

import WebSocketClient from './websocket.js';

/**
 * ChatRoom组件, 显示, 发送和接收用户聊天内容.
 * @param {WebSocketClient} websocket - WebSocket客户端.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <ChatRoom
 *     websocket={new WebSocketClient('wss://example.com/ws/')}
 * />
 */
export default function ChatRoom({websocket}) {
    // 聊天输入框内容.
    const [chatContent, setChatContent] = useState('');

    /**
     * 处理聊天表单的提交.
     * @param {Event} e - 表单提交事件.
     */
    function handleSubmit(e) {
        e.preventDefault();

        websocket.sendMessage(chatContent, 'chat');
        setChatContent('');
    }

    /**
     * 处理聊天输入框值的变化.
     * @param {Event} e - 输入框变化事件.
     */
    function handleChatContentChange(e) {
        setChatContent(e.target.value);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={chatContent}
                onChange={handleChatContentChange}
            />
            <button>发送</button>
        </form>
    );
}

ChatRoom.propTypes = {
    websocket: PropTypes.instanceOf(WebSocketClient).isRequired
};
