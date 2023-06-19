import React, {useEffect, useRef, useState} from 'react';

// 使用的相关组件.
import ChatRoom from './components/chat-room.jsx';
import LoginPage from './components/login-page.jsx';
import VideoPlayer from './components/video-player.jsx';

import {UserContext} from './contexts.js';
import WebSocketClient from './websocket.js';

import './styles/App.css';

export default function App() {
    const websocketRef = useRef(null);
    // 登录用户信息.
    const [user, setUser] = useState({name: ''});
    // 是否登录信息.
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const sources = {
        src: 'http://192.168.31.62:8000/video/我们亲爱的Steve/',
        type: 'application/x-mpegURL'
    };

    useEffect(() => {
        // 确保只创建一个WebSocket连接.
        websocketRef.current = new WebSocketClient(
            'ws://192.168.31.62:8000/ws/'
        );
    }, []);

    /**
     * 处理登录用户信息的变化.
     * @param {React.ChangeEvent<HTMLInputElement>} e - 输入框变化事件.
     */
    function handleUserChange(e) {
        setUser({
            name: e.target.value
        });
    }

    /**
     * 提交登录事件.
     */
    function handleIsLoggedInClick() {
        setIsLoggedIn(true);
    }

    return (
        <div>
            {isLoggedIn ? (
                <div className='video-chat-container'>
                    <UserContext.Provider value={user}>
                        <div className='video-player-container'>
                            <VideoPlayer
                                sources={sources}
                                websocket={websocketRef.current}
                            />
                        </div>
                        <div className='chat-room-container'>
                            <ChatRoom websocket={websocketRef.current}/>
                        </div>
                    </UserContext.Provider>
                </div>
            ): (
                <LoginPage
                    user={user}
                    onUserChange={handleUserChange}
                    onIsLoggedInClick={handleIsLoggedInClick}
                />
            )}
        </div>
    );
}
