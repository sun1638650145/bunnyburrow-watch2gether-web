import PropTypes from 'prop-types';
import React, {useContext, useEffect, useRef} from 'react';

import {UserContext} from '../contexts.js';

import '../styles/message-list.css';

/**
 * MyMessage组件, 用于展示当前用户发送的消息.
 * @param {Object} messageObject - 消息对象.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <MyMessage messageObject={messageObject}/>
 */
function MyMessage({messageObject}) {
    const avatar = messageObject.user.avatar;
    const msg = messageObject.msg;

    return (
        <li className='my-message'>
            <div className='content'>{msg}</div>
            <div
                className='avatar'
                style={{ backgroundImage: `url(${avatar})` }}
            />
        </li>
    );
}

/**
 * OtherMessage组件, 用于展示其他用户发送的消息.
 * @param {Object} messageObject - 消息对象.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <OtherMessage messageObject={messageObject}/>
 */
function OtherMessage({messageObject}) {
    const name = messageObject.user.name;
    const avatar = messageObject.user.avatar;
    const msg = messageObject.msg;

    return (
        <li className='other-message'>
            <div
                className='avatar'
                style={{ backgroundImage: `url(${avatar})` }}
            />
            <div className='name-content-container'>
                <div className='name'>{name}</div>
                <div className='content'>{msg}</div>
            </div>
        </li>
    );
}

/**
 * MessageList组件, 显示用户聊天内容.
 * @param {Object[]} chatList - 聊天内容列表.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <MessageList chatList={chatList}/>
 */
export default function MessageList({chatList}) {
    const chatListRef = useRef(null);
    // 用户信息.
    const user = useContext(UserContext);

    // 有新消息时, 始终将滚动条保持在底部.
    useEffect(() => {
        chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }, [chatList]);

    return (
        <ol className='message-list' ref={chatListRef}>
            {chatList.map((messageObject, idx) =>
                messageObject.user.clientID === user.clientID ? (
                    <MyMessage key={idx} messageObject={messageObject}/>
                ): (
                    <OtherMessage key={idx} messageObject={messageObject}/>
                )
            )}
        </ol>
    );
}

MyMessage.propTypes = {
    messageObject: PropTypes.object.isRequired
};
OtherMessage.propTypes = {
    messageObject: PropTypes.object.isRequired
};
MessageList.propTypes = {
    chatList: PropTypes.arrayOf(PropTypes.object).isRequired
};
