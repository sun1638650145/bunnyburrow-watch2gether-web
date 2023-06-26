import React, {useEffect, useRef, useState} from 'react';
import {useImmer} from 'use-immer';

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
    const [user, updateUser] = useImmer({
        avatar: '', // 用户头像的URL.
        name: '' // 用户昵称.
    });
    // 流媒体视频源.
    const [sources, updateSources] = useImmer({
        src: '',
        type: 'application/x-mpegURL' // 暂不可自定义媒体类型.
    });
    // 是否登录信息.
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 确保只创建一个WebSocket连接.
        websocketRef.current = new WebSocketClient(
            'ws://192.168.31.62:8000/ws/'
        );
    }, []);

    /**
     * 处理流媒体视频源的变化.
     * @param {React.ChangeEvent<HTMLInputElement>} e - 输入框变化事件.
     */
    function handleSourcesSrcChange(e) {
        updateSources(draft => {
            draft.src = e.target.value;
        });
    }

    /**
     * 处理登录用户头像URL的变化.
     * @param {React.ChangeEvent<HTMLInputElement>} e - 输入框变化事件.
     */
    function handleUserAvatarChange(e) {
        // 将图片文件转换成URL.
        const reader = new FileReader();
        reader.onload = () => {
            updateUser(draft => {
                draft.avatar = reader.result;
            });
        };

        const file = e.target.files[0];
        reader.readAsDataURL(file);
    }

    /**
     * 处理登录用户昵称的变化.
     * @param {React.ChangeEvent<HTMLInputElement>} e - 输入框变化事件.
     */
    function handleUserNameChange(e) {
        updateUser(draft => {
            draft.name = e.target.value;
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
                        <VideoPlayer
                            sources={sources}
                            websocket={websocketRef.current}
                        />
                        <ChatRoom websocket={websocketRef.current}/>
                    </UserContext.Provider>
                </div>
            ): (
                <LoginPage
                    sources={sources}
                    user={user}
                    onSourcesSrcChange={handleSourcesSrcChange}
                    onUserAvatarChange={handleUserAvatarChange}
                    onUserNameChange={handleUserNameChange}
                    onIsLoggedInClick={handleIsLoggedInClick}
                />
            )}
        </div>
    );
}
