import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {useImmer} from 'use-immer';

import WebSocketClient from './websocket.js';

/**
 * ChatRoom组件, 显示, 发送和接收用户聊天内容.
 * @param {WebSocketClient} websocket - WebSocket客户端.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <ChatRoom websocket={new WebSocketClient('wss://example.com/ws/')}/>
 */
export default function ChatRoom({websocket}) {
    // 聊天内容列表.
    const [chatList, updateChatList] = useImmer([]);
    // 聊天输入框内容.
    const [inputContent, setInputContent] = useState('');

    /**
     * 处理聊天输入框值的变化.
     * @param {React.ChangeEvent<HTMLInputElement>} e - 输入框变化事件.
     */
    function handleChatContentChange(e) {
        setInputContent(e.target.value);
    }

    /**
     * 处理聊天表单的提交.
     * @param {FormEvent} e - 表单提交事件.
     */
    function handleSubmit(e) {
        e.preventDefault();

        websocket.sendMessage(inputContent, 'chat');
        setInputContent('');
        updateChatList(draft => {
            draft.push(inputContent); // 同时在本侧显示.
        });
    }

    // 将新消息添加到聊天内容列表chatList中.
    useEffect(() => {
        websocket.setChatListHandler(inputContent => {
            updateChatList(draft => {
                draft.push(inputContent);
            });
        });
    }, [chatList]);

    return (
        <div id='chat-room'>
            <ul>
                {chatList.map((inputContent, idx) =>
                    <li key={idx}>{inputContent}</li>
                )}
            </ul>
            <form onSubmit={handleSubmit}>
                <input
                    value={inputContent}
                    onChange={handleChatContentChange}
                />
                <button>发送</button>
            </form>
        </div>
    );
}

ChatRoom.propTypes = {
    websocket: PropTypes.instanceOf(WebSocketClient).isRequired
};
