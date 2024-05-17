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
        [2024, {avatar: 'https://example.com/avatar1.png', name: 'Bar'}],
        [2025, {avatar: 'https://example.com/avatar2.png', name: 'Bot'}],
        [2026, {avatar: 'https://example.com/avatar3.png', name: 'Foo'}]
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

    test('正确渲染好友列表', () => {
        const friends = friendContextValue.friends;

        // 断言.
        expect(screen.getByText(`在线好友: ${friends.size}`)).toBeInTheDocument();
        friends.forEach(friend => {
            const avatar = friend.avatar;
            const name = screen.getByText(friend.name);

            expect(name).toHaveStyle(`backgroundImage: \`url(${avatar})\``);
            expect(name).toBeInTheDocument();
        });
    });
});
