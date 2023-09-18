import PropTypes from 'prop-types';
import React from 'react';

import ChatRoom from './chat-room.jsx';
import UsersPanel from './users-panel.jsx';
import VideoPlayer from './video-player.jsx';

import {UserContext} from '../contexts.js';
import WebSocketClient from '../websocket.js';

import '../styles/home-page.css';

/**
 * HomePage组件, 用于渲染主页面.
 * @param {Object} user - 登录用户信息.
 * @param {Object} sources - 流媒体视频源(包括URL和媒体类型(MIME types)).
 * @param {WebSocketClient} websocket - WebSocket客户端.
 * @returns {JSX.Element}
 * @constructor
 * <HomePage
 *     user={user}
 *     sources={sources}
 *     websocket={new WebSocketClient('wss://example.com/ws/', user)
 * />
 */
export default function HomePage({user, sources, websocket}) {
    return (
        <div className='home'>
            <UserContext.Provider value={user}>
                <div className='player-panel-container'>
                    <VideoPlayer
                        sources={sources}
                        websocket={websocket}
                    />
                    <UsersPanel websocket={websocket}/>
                </div>
                <ChatRoom websocket={websocket}/>
            </UserContext.Provider>
        </div>
    );
}

HomePage.propTypes = {
    user: PropTypes.object.isRequired,
    sources: PropTypes.object.isRequired,
    websocket: PropTypes.instanceOf(WebSocketClient).isRequired
};
