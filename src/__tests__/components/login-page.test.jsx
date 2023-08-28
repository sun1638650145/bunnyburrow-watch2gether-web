import React from 'react';
import {describe, expect, jest, test} from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import {fireEvent, render, screen} from '@testing-library/react';

import LoginPage from '../../components/login-page.jsx';

// 模拟函数.
const mockOnUserAvatarChange = jest.fn();
const mockOnUserNameChange = jest.fn();
const mockOnSourcesSrcChange = jest.fn();
const mockOnWebSocketUrlChange = jest.fn();
const mockOnIsLoggedInClick = jest.fn();

describe('LoginPage', () => {
    test('昵称为空时', () => {
        const user = {
            avatar: 'https://example.com/example.png',
            name: ''
        };
        const sources = {
            src: 'https://example.com/video/',
            type: 'application/x-mpegURL'
        };
        const webSocketUrl = 'wss://example.com/ws/';

        render(
            <LoginPage
                user={user}
                sources={sources}
                webSocketUrl={webSocketUrl}
                onUserAvatarChange={mockOnUserAvatarChange}
                onUserNameChange={mockOnUserNameChange}
                onSourcesSrcChange={mockOnSourcesSrcChange}
                onWebSocketUrlChange={mockOnWebSocketUrlChange}
                onIsLoggedInClick={mockOnIsLoggedInClick}
            />
        );

        const loginButton = screen.getByText('加入');
        fireEvent.click(loginButton);
        const loginErrorMessage = screen.getByText('昵称不能为空, 请输入昵称并重试.');

        expect(loginErrorMessage).toBeInTheDocument();
        expect(mockOnIsLoggedInClick).not.toBeCalled(); // 加入没有被调用.
    });

    test('流媒体服务器地址为空或者不合法时', () => {
        const user = {
            avatar: 'https://example.com/example.png',
            name: 'Steve'
        };
        const sources = {
            src: '',
            type: 'application/x-mpegURL'
        };
        const webSocketUrl = 'wss://example.com/ws/';
        render(
            <LoginPage
                user={user}
                sources={sources}
                webSocketUrl={webSocketUrl}
                onUserAvatarChange={mockOnUserAvatarChange}
                onUserNameChange={mockOnUserNameChange}
                onSourcesSrcChange={mockOnSourcesSrcChange}
                onWebSocketUrlChange={mockOnWebSocketUrlChange}
                onIsLoggedInClick={mockOnIsLoggedInClick}
            />
        );

        const loginButton = screen.getByText('加入');
        fireEvent.click(loginButton);
        const streamErrorMessage = screen.getByText(
            '流媒体服务器地址为空或者不合法, 请重新输入地址并重试.'
        );

        expect(streamErrorMessage).toBeInTheDocument();
        expect(mockOnIsLoggedInClick).not.toBeCalled(); // 加入没有被调用.
    });

    test('WebSocket服务器地址为空或者不合法时', () => {
        const user = {
            avatar: 'https://example.com/example.png',
            name: 'Steve'
        };
        const sources = {
            src: 'https://example.com/video/',
            type: 'application/x-mpegURL'
        };
        const webSocketUrl = '';
        render(
            <LoginPage
                user={user}
                sources={sources}
                webSocketUrl={webSocketUrl}
                onUserAvatarChange={mockOnUserAvatarChange}
                onUserNameChange={mockOnUserNameChange}
                onSourcesSrcChange={mockOnSourcesSrcChange}
                onWebSocketUrlChange={mockOnWebSocketUrlChange}
                onIsLoggedInClick={mockOnIsLoggedInClick}
            />
        );

        const loginButton = screen.getByText('加入');
        fireEvent.click(loginButton);
        const websocketErrorMessage = screen.getByText(
            'WebSocket服务器地址为空或者不合法, 请重新输入地址并重试.'
        );

        expect(websocketErrorMessage).toBeInTheDocument();
        expect(mockOnIsLoggedInClick).not.toBeCalled(); // 加入没有被调用.
    });

    test('成功加入', () => {
        const user = {
            avatar: 'https://example.com/example.png',
            name: 'Steve'
        };
        const sources = {
            src: 'https://example.com/video/video.m3u8',
            type: 'application/x-mpegURL'
        };
        const webSocketUrl = 'wss://example.com/ws/';

        render(
            <LoginPage
                user={user}
                sources={sources}
                webSocketUrl={webSocketUrl}
                onUserAvatarChange={mockOnUserAvatarChange}
                onUserNameChange={mockOnUserNameChange}
                onSourcesSrcChange={mockOnSourcesSrcChange}
                onWebSocketUrlChange={mockOnWebSocketUrlChange}
                onIsLoggedInClick={mockOnIsLoggedInClick}
            />
        );

        const loginButton = screen.getByText('加入');
        fireEvent.click(loginButton);

        expect(mockOnIsLoggedInClick).toBeCalledTimes(1);
    });
});
