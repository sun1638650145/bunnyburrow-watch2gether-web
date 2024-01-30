import React, {Fragment, useContext} from 'react';
import {FriendsContext} from '../../contexts/friends-context.jsx';

/**
 * 好友列表组件, 用于显示好友列表.
 * @returns {React.ReactElement}
 * @constructor
 */
export default function FriendsList() {
    // 使用好友列表Context.
    const {friends} = useContext(FriendsContext);

    return (
        <Fragment>
            <div className='online-friends'>在线好友: {friends.size}</div>
            <ol className='friends-list'>
                {[...friends].map(([clientID, friend]) =>
                    <li key={clientID}>
                        <div
                            className='avatar'
                            style={{backgroundImage: `url(${friend.avatar})`}}
                        />
                        <div className='name'>
                            <div className='animation'>{friend.name}</div>
                        </div>
                    </li>
                )}
            </ol>
        </Fragment>
    );
}
