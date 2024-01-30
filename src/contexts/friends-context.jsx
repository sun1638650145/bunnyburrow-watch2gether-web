import {enableMapSet} from 'immer';
import PropTypes from 'prop-types';
import React, {createContext} from 'react';
import {useImmer} from 'use-immer';

// 显式开启对原生Map和Set的支持.
enableMapSet();

/**
 * 好友列表的键类型定义.
 * @typedef {number} clientID 用户客户端ID.
 */

/**
 * 好友列表的值类型定义.
 * @typedef {Object} user 用户信息.
 * @property {string} avatar 头像的Base64.
 * @property {string} name 昵称.
 */

/**
 * 好友列表Context值.
 * @typedef {Object} FriendsContextValue
 * @property {Map<clientID, user>} friends 好友列表.
 * @property {function} addFriend 向列表添加新好友函数.
 * @property {function} removeFriend 从列表中移除指定客户端函数.
 */

/**
 * 好友列表Context.
 * @type {React.Context<FriendsContextValue>}
 */
export const FriendsContext = createContext({});

/**
 * 好友列表Context的Provider.
 * @param {React.ReactNode} children 子组件.
 * @returns {React.ReactNode}
 * @constructor
 */
export function FriendsProvider({children}) {
    // 好友列表.
    const [friends, updateFriends] = useImmer(new Map());

    /**
     * 向列表添加好友函数.
     * @param {user} friend 好友用户信息.
     */
    function addFriend(friend) {
        updateFriends(draft => {
            draft.set(friend.clientID, {
                avatar: friend.avatar,
                name: friend.name
            });
        });
    }

    /**
     * 从列表中移除指定客户端函数.
     * @param {number} clientID 好友的客户端ID.
     */
    function removeFriend(clientID) {
        updateFriends(draft =>  {
            draft.delete(clientID);
        });
    }

    return (
        <FriendsContext.Provider value={{friends, addFriend, removeFriend}}>
            {children}
        </FriendsContext.Provider>
    );
}

FriendsProvider.propTypes = {
    children: PropTypes.node
};
