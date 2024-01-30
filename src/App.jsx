import React, {useState} from 'react';

import HomePage from './components/home-page/home-page.jsx';
import LoginPage from './components/login-page/login-page.jsx';
import {FriendsProvider} from './contexts/friends-context.jsx';
import {StreamingProvider} from './contexts/streaming-context.jsx';
import {UserProvider} from './contexts/user-context.jsx';
import {WebSocketProvider} from './contexts/websocket-context.jsx';

export default function App() {
    // 登陆状态.
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    /**
     * 点击加入按钮函数.
     */
    function handleLoginClick() {
        setIsLoggedIn(true);
    }

    return (
        <UserProvider>
            <FriendsProvider>
                <StreamingProvider>
                    <WebSocketProvider>
                        {isLoggedIn ? (
                            <HomePage/>
                        ) : (
                            <LoginPage onLoginClick={handleLoginClick}/>
                        )}
                    </WebSocketProvider>
                </StreamingProvider>
            </FriendsProvider>
        </UserProvider>
    );
}
