import PropTypes from 'prop-types';
import React, {useContext, useEffect} from 'react';
import {useImmer} from 'use-immer';

import MessageList from './message-list.jsx';
import {UserContext} from '../contexts.js';
import WebSocketClient from '../websocket.js';

import '../styles/chat-room.css';

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
    const user = useContext(UserContext);
    const [inputContent, updateInputContent] = useImmer({
        user: user, // 直接传入用户信息.
        content: ''
    });

    /**
     * 处理聊天输入框值的变化.
     * @param {React.ChangeEvent<HTMLInputElement>} e - 输入框变化事件.
     */
    function handleChatContentChange(e) {
        updateInputContent(draft => {
            draft.content = e.target.value;
        });
    }

    /**
     * 处理聊天表单的提交.
     * @param {FormEvent} e - 表单提交事件.
     */
    function handleSubmit(e) {
        e.preventDefault();

        websocket.sendMessage(inputContent, 'chat');
        updateInputContent(draft => {
            draft.content = '';
        });
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
        <div className='chat-room'>
            <MessageList chatList={chatList}/>
            <form
                className='chat-form'
                onSubmit={handleSubmit}
            >
                <input
                    className='chat-input'
                    value={inputContent.content}
                    onChange={handleChatContentChange}
                />
                <button className='send-button'>发送</button>
            </form>
        </div>
    );
}

ChatRoom.propTypes = {
    websocket: PropTypes.instanceOf(WebSocketClient).isRequired
};
