import React, {useContext, useEffect, useState} from 'react';
import {useImmer} from 'use-immer';

import MessagesList from './messages-list.jsx';
import {UserContext} from '../../contexts/user-context.jsx';
import {WebSocketContext} from '../../contexts/websocket-context.jsx';

/**
 * 聊天室组件, 用于展示聊天界面和处理聊天消息.
 * @returns {React.ReactElement}
 * @constructor
 */
export default function ChatRoom() {
    // 使用用户信息Context.
    const {user} = useContext(UserContext);
    // 使用WebSocket服务Context.
    const {websocketClient} = useContext(WebSocketContext);

    // 禁用发送按钮变量.
    const [isDisabled, setIsDisabled] = useState(true);
    // 聊天消息变量.
    const [message, setMessage] = useState('');
    // 聊天消息列表变量.
    const [messages, updateMessages] = useImmer([]);

    /**
     * 处理输入聊天消息事件函数.
     * @param {React.ChangeEvent<HTMLInputElement>} e 输入框变化事件.
     */
    function handleMessageChange(e) {
        const message = e.target.value;

        setIsDisabled(message.trim() === ''); // 聊天消息不为空时, 启用发送按钮.
        setMessage(message);
    }

    /**
     * 接收聊天消息函数.
     * @param {string} message 聊天消息.
     * @param {number} clientID 用户的客户端ID.
     */
    function receiveMessage(message, clientID) {
        updateMessages(draft => {
            draft.push({
                message: message, // 发送的聊天消息已经执行过trim().
                user: {
                    clientID: clientID
                }
            });
        });
    }

    /**
     * 发送聊天消息函数.
     * @param {React.FormEvent<HTMLFormElement>} e 表单提交事件.
     */
    function sendMessage(e) {
        e.preventDefault();

        websocketClient.broadcast({
            action: 'chat',
            message: message.trim(),
            user: {
                // 只发送客户端ID以减小网络开销.
                clientID: user.clientID
            }
        });

        // 发送聊天消息后禁用按钮并清空输入框.
        setIsDisabled(true);
        setMessage('');
        // 存储发送的聊天消息.
        updateMessages(draft => {
            draft.push({
                message: message.trim(),
                user: {
                    // 只发送客户端ID以减小网络开销.
                    clientID: user.clientID
                }
            });
        });
    }

    // 添加接收聊天消息事件监听函数给WebSocket客户端.
    useEffect(() => {
        websocketClient.on('receiveMessage', receiveMessage);
    }, []);

    return (
        <div className='chat-room'>
            <MessagesList messages={messages}/>
            <form
                className='chat-form'
                onSubmit={sendMessage}
            >
                <input
                    className='chat-input'
                    value={message}
                    onChange={handleMessageChange}
                />
                <button
                    className='send-button'
                    disabled={isDisabled}
                >
                    发送
                </button>
            </form>
        </div>
    );
}
