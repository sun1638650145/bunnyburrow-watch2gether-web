import React from 'react';
import {beforeEach, describe, expect, test} from '@jest/globals';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import HomePage from '../components/home-page/home-page.jsx';
import {FriendsContext} from '../contexts/friends-context.jsx';
import {UserProvider} from '../contexts/user-context.jsx';
import {StreamingProvider} from '../contexts/streaming-context.jsx';
import {WebSocketContext} from '../contexts/websocket-context.jsx';
import WebSocketClient from '../websockets/websocket.js';

const friendContextValue = {
    friends: new Map([
        [Date.now(), {avatar: '', name: 'Bot'}],
        [Date.now(), {avatar: '', name: 'Bar'}],
        [Date.now(), {avatar: '', name: 'Foo'}]
    ])
};

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
                <FriendsContext.Provider value={friendContextValue}>
                    <StreamingProvider>
                        <WebSocketContext.Provider
                            value={webSocketContextValue}
                        >
                            <HomePage/>
                        </WebSocketContext.Provider>
                    </StreamingProvider>
                </FriendsContext.Provider>
            </UserProvider>
        );
    });

    test('获取好友列表中在线好友的数量', () => {
        const onlineFriends = friendContextValue.friends.size;

        // 断言.
        expect(screen.getByText(`在线好友: ${onlineFriends}`)).toBeInTheDocument();
    });
});
