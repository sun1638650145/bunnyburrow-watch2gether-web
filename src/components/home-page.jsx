import PropTypes from 'prop-types';
import React from 'react';

import ChatRoom from './chat-room.jsx';
import UsersPanel from './users-panel.jsx';
import VideoPlayer from './video-player.jsx';

import {UserContext} from '../contexts.js';
import WebSocketClient from '../websocket.js';

export default function HomePage({user, sources, websocket}) {
    return (
        <div className='video-chat-container'>
            <UserContext.Provider value={user}>
                <VideoPlayer
                    sources={sources}
                    websocket={websocket}
                />
                <UsersPanel websocket={websocket}/>
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
