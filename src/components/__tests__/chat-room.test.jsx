import React from 'react';
import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import {fireEvent, render, screen} from '@testing-library/react';

import ChatRoom from '../chat-room.jsx';
import WebSocketClient from '../../websocket.js';

// 模拟WebSocketClient模块.
jest.mock('../../websocket.js');

describe('ChatRoom', () => {
    // 模拟WebSocket客户端.
    let mockWebSocketClient;

    beforeEach(() => {
        mockWebSocketClient = new WebSocketClient('ws://example.com/ws/');
    });

    test('聊天内容为空或仅为空格时', () => {
        const {container} = render(<ChatRoom websocket={mockWebSocketClient}/>);

        const chatInput = container.querySelector('.chat-input');
        const sendButton = screen.getByText('发送');

        expect(sendButton).toBeDisabled(); // 聊天内容为空, 禁用发送按钮.
        fireEvent.change(chatInput, {
            target: {
                value: ' '
            }
        });
        expect(sendButton).toBeDisabled(); // 聊天内容仅为空格, 禁用发送按钮.
    });

    test('聊天内容不为空', () => {
        const {container} = render(<ChatRoom websocket={mockWebSocketClient}/>);

        const chatInput = container.querySelector('.chat-input');
        const sendButton = screen.getByText('发送');
        fireEvent.change(chatInput, {
            target: {
                value: 'Hello, World!'
            }
        });

        expect(sendButton).toBeEnabled(); // 允许发送.
    });

    test('显示用户聊天内容', () => {
        const {container} = render(<ChatRoom websocket={mockWebSocketClient}/>);

        const chatInput = container.querySelector('.chat-input');
        const sendButton = screen.getByText('发送');
        fireEvent.change(chatInput, {
            target: {
                value: 'Hello, World!'
            }
        });
        fireEvent.click(sendButton);

        const message = screen.getByText('Hello, World!');
        expect(message).toBeInTheDocument();
    });
});
