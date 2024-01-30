import PropTypes from 'prop-types';
import React, {useContext, useEffect, useRef} from 'react';
import {useImmer} from 'use-immer';

import {FriendsContext} from '../../contexts/friends-context.jsx';
import {UserContext} from '../../contexts/user-context.jsx';

/**
 * 用户信息类型定义.
 * @typedef {Object|undefined} user 用户信息.
 * @property {string} avatar 头像的Base64.
 * @property {number} clientID 客户端ID.
 * @property {string} name 昵称.
 */

/**
 * 聊天消息对象类型定义.
 * @typedef {Object} message 聊天消息对象.
 * @property {string} message 聊天消息.
 * @property {Object} user 用户信息.
 * @property {number} user.clientID 客户端ID.
 */

/**
 * 用于展示用户自己的聊天消息组件.
 * @param {string} message 聊天消息.
 * @param {user} user 用户信息.
 * @returns {React.ReactElement}
 * @constructor
 */
function MyMessage({message, user}) {
    return (
        <li className='my-message'>
            <div className='message'>{message}</div>
            <div
                className='avatar'
                style={{backgroundImage: `url(${user.avatar})`}}
            />
        </li>
    );
}

/**
 * 用于展示其他用户的聊天消息组件.
 * @param {string} message 聊天消息.
 * @param {user} user 用户信息.
 * @returns {React.ReactElement}
 * @constructor
 */
function OtherMessage({message, user}) {
    return (
        <li className='other-message'>
            <div
                className='avatar'
                style={{backgroundImage: `url(${user.avatar})`}}
            />
            <div className='name-message'>
                <div className='name'>{user.name}</div>
                <div className='message'>{message}</div>
            </div>
        </li>
    );
}

/**
 * 聊天消息列表组件, 用于展示聊天界面上的所有消息.
 * @param {Array<message>} messages 聊天消息列表.
 * @returns {React.ReactElement}
 * @constructor
 */
export default function MessagesList({messages}) {
    // 使用好友列表Context.
    const {friends} = useContext(FriendsContext);
    // 使用用户信息Context.
    const {user} = useContext(UserContext);
    // 聊天消息列表引用ref.
    const messagesRef = useRef(null);

    // 好友列表历史备份变量.
    const [friendsHistory, updateFriendsHistory] = useImmer(new Map());

    // 当有新聊天消息时, 始终将滚动条保持在底部.
    useEffect(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, [messages]);

    // 当好友列表更新时, 只添加新好友到列表.
    useEffect(() => {
        updateFriendsHistory(draft => {
            friends.forEach((user, clientID) => {
                draft.set(clientID, user);
            });
        });
    }, [friends]);

    return (
        <ol className='messages-list' ref={messagesRef}>
            {messages.map((message, index) =>
                message.user.clientID === user.clientID ? (
                    <MyMessage
                        key={index}
                        message={message.message}
                        user={friendsHistory.get(message.user.clientID)}
                    />
                ) : (
                    <OtherMessage
                        key={index}
                        message={message.message}
                        user={friendsHistory.get(message.user.clientID)}
                    />
                )
            )}
        </ol>
    );
}

MyMessage.propTypes = {
    message: PropTypes.string.isRequired,
    user: PropTypes.exact({
        avatar: PropTypes.string,
        clientID: PropTypes.number,
        name: PropTypes.string
    }).isRequired
};

OtherMessage.propTypes = {
    message: PropTypes.string.isRequired,
    user: PropTypes.exact({
        avatar: PropTypes.string,
        clientID: PropTypes.number,
        name: PropTypes.string
    }).isRequired
};

MessagesList.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.exact({
        message: PropTypes.string.isRequired,
        user: PropTypes.exact({
            clientID: PropTypes.number.isRequired
        }).isRequired
    })).isRequired
};
