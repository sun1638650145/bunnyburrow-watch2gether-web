import {exec} from 'child_process';

import React from 'react';
import {afterAll, beforeAll, beforeEach,
    describe, expect, test} from '@jest/globals';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';

import HomePage from '../components/home-page/home-page.jsx';
import {FriendsContext} from '../contexts/friends-context.jsx';
import {UserContext} from '../contexts/user-context.jsx';
import {StreamingProvider} from '../contexts/streaming-context.jsx';
import {WebSocketContext} from '../contexts/websocket-context.jsx';
import WebSocketClient from '../websockets/websocket.js';

const friendContextValue = {
    friends: new Map([
        [2023, {avatar: 'https://example.com/avatar1.png', name: 'Bot'}],
        [2024, {avatar: 'https://example.com/avatar2.png', name: 'Foo'}],
        [2025, {avatar: 'https://example.com/avatar3.png', name: 'Bar'}]
    ])
};

const userContextValue = {
    user: {
        ...friendContextValue.friends.get(2023),
        clientID: 2023
    }
};

const webSocketContextValue = {
    websocketClient: new WebSocketClient(
        'ws://127.0.0.1:8000/ws/',
        userContextValue.user
    )
};

let serverProcess;

describe('HomePage', () => {
    beforeAll((done) => {
        // 启动WebSocket服务.
        serverProcess = exec('w2g-cli launch ~/w2g');
        // 等待WebSocket服务启动.
        setTimeout(done, 2000);
    });

    beforeEach(() => {
        // 渲染主页.
        render(
            <UserContext.Provider value={userContextValue}>
                <FriendsContext.Provider value={friendContextValue}>
                    <StreamingProvider>
                        <WebSocketContext.Provider
                            value={webSocketContextValue}
                        >
                            <HomePage/>
                        </WebSocketContext.Provider>
                    </StreamingProvider>
                </FriendsContext.Provider>
            </UserContext.Provider>
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

    test('发送聊天消息时', async () => {
        const chatInput = screen.getByRole('textbox');
        const sendButton = screen.getByRole('button', {name: '发送'});

        // 断言(聊天消息为空禁用发送按钮).
        expect(chatInput).toHaveValue('');
        expect(sendButton).toBeDisabled();

        // 模拟用户输入聊天消息操作.
        await userEvent.type(chatInput, 'Hello, World!');

        // 断言(聊天消息不为空启用发送按钮).
        expect(sendButton).toBeEnabled();

        // 模拟用户执行发送操作.
        await userEvent.click(sendButton);

        // 断言(正确渲染用户自己的聊天消息).
        expect(screen.getByText('Hello, World!')).toBeInTheDocument();

        // 断言(发送聊天消息后禁用按钮并清空输入框).
        expect(chatInput).toHaveValue('');
        expect(sendButton).toBeDisabled();
    });

    afterAll(() => {
        // 关闭WebSocket服务.
        serverProcess.kill();
    });
});
