import PropTypes from 'prop-types';
import React, {useContext, useEffect} from 'react';
import {useImmer} from 'use-immer';

import {UserContext} from '../contexts.js';
import WebSocketClient from '../websocket.js';

import '../styles/users-panel.css';

/**
 * UsersPanel组件, 用于显示全部在线用户的信息.
 * @param {WebSocketClient} websocket - WebSocket客户端.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <UsersPanel websocket={new WebSocketClient('wss://example.com/ws/', user)}/>
 */
export default function UsersPanel({websocket}) {
    // 登录用户信息.
    const user = useContext(UserContext);
    // 全部登录用户信息列表.
    const [userList, updateUsers] = useImmer([user]); // 初始化为当前登录用户信息.

    // 将新用户添加到用户信息列表users中.
    useEffect(() => {
        websocket.setUsersHandler(user => {
            updateUsers(draft => {
                draft.push(user);
            });
        });
    }, [userList]);

    return (
        <div className='users-panel'>
            <div>在线用户: {userList.length}</div>
            <ol className='users-list'>
                {userList.map(user =>
                    <li key={user.clientID}>
                        <div
                            className='avatar'
                            style={{ backgroundImage: `url(${user.avatar})` }}
                        />
                        <div className='name'>{user.name}</div>
                    </li>
                )}
            </ol>
        </div>
    );
}

UsersPanel.propTypes = {
    websocket: PropTypes.instanceOf(WebSocketClient).isRequired
};
