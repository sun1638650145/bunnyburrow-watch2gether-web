import React, {useContext, useEffect} from 'react';
import {isMobile} from 'react-device-detect';

import ChatRoom from './chat-room.jsx';
import FriendsList from './friends-list.jsx';
import VideoPlayer from './video-player.jsx';
import {WebSocketContext} from '../../contexts/websocket-context.jsx';

import '../../styles/home-page/home-page.css';

/**
 * 主页组件.
 * @returns {React.ReactElement}
 * @constructor
 */
export default function HomePage() {
    // 使用WebSocket服务Context.
    const {websocketClient} = useContext(WebSocketContext);

    // 监听浏览器关闭或刷新事件, 主动关闭WebSocket连接.
    useEffect(() => {
        if (isMobile) {
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    // TODO(Steve): 目前Android手机和iPad正确支持刷新和关闭标签页,
                    //  切换标签页和后台挂起浏览器会被错误关闭; iPhone仅正确支持刷新网页.
                    websocketClient.close();
                }
            });
        } else {
            window.addEventListener('beforeunload', () => {
                websocketClient.close();
            });
        }
    }, []);

    return (
        <div className='home-page'>
            <div className='landscape-left-container portrait-top-container'>
                <VideoPlayer/>
            </div>
            <div
                className='landscape-right-container portrait-bottom-container'
            >
                <FriendsList/>
                <ChatRoom/>
            </div>
        </div>
    );
}
