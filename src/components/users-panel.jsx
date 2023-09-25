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
    // 用户列表.
    const [userList, updateUsers] = useImmer([user]); // 初始化为当前登录用户信息.

    // 在用户信息列表userList中修改其他用户信息.
    useEffect(() => {
        /**
         * 将其他用户添加到用户列表.
         * @param {Object} user - 要添加的用户对象.
         */
        function handleAddUser(user) {
            updateUsers(draft => {
                draft.push(user);
            });
        }

        /**
         * 从用户列表中删除指定客户端ID的用户.
         * @param {int} clientID - 客户端ID.
         */
        function handleDeleteUser(clientID) {
            updateUsers(
                userList.filter(user => user.clientID !== clientID)
            );
        }

        websocket.setUsersHandler(data => {
            if (data.msg === 'login' || data.msg === 'ack') {
                handleAddUser(data.user);
            } else if (data.msg === 'logout') {
                handleDeleteUser(data.user.clientID);
            }
        });
    }, [userList]);

    return (
        <div className='users-panel'>
            <div className='online-users'>在线用户: {userList.length}</div>
            <ol className='users-list'>
                {userList.map(user =>
                    <li key={user.clientID}>
                        <div
                            className='avatar'
                            style={{ backgroundImage: `url(${user.avatar})` }}
                        />
                        <div className='name'>
                            {user.name}
                        </div>
                    </li>
                )}
            </ol>
        </div>
    );
}

UsersPanel.propTypes = {
    websocket: PropTypes.instanceOf(WebSocketClient).isRequired
};
