import React from 'react';
import {beforeEach, describe, expect, test} from '@jest/globals';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import HomePage from '../components/home-page/home-page.jsx';
import {FriendsProvider} from '../contexts/friends-context.jsx';
import {UserProvider} from '../contexts/user-context.jsx';
import {StreamingProvider} from '../contexts/streaming-context.jsx';
import {WebSocketContext} from '../contexts/websocket-context.jsx';
import WebSocketClient from '../websockets/websocket.js';

const webSocketContextValue = {
    websocketClient: new WebSocketClient(
        'ws://example.com/ws/',
        {
            avatar: '',
            clientID: Date.now(),
            name: 'Bot'
        }
    ),
};

describe('HomePage', () => {
    beforeEach(() => {
        // 渲染主页.
        render(
            <UserProvider>
                <FriendsProvider>
                    <StreamingProvider>
                        <WebSocketContext.Provider
                            value={webSocketContextValue}
                        >
                            <HomePage/>
                        </WebSocketContext.Provider>
                    </StreamingProvider>
                </FriendsProvider>
            </UserProvider>
        );
    });

    test('获取好友列表中在线好友的数量', () => {
        expect(screen.getByText('在线好友: 0')).toBeInTheDocument();
    });
});
