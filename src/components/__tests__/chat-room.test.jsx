import React from 'react';
import {describe, expect, test} from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import {render, screen} from '@testing-library/react';

import ChatRoom from '../chat-room.jsx';
import WebSocketClient from '../../websocket.js';

describe('ChatRoom', () => {
    test('聊天内容为空禁止发送', () => {
        const mockWebSocketClient = new WebSocketClient('ws://example.com/ws/');
        render(<ChatRoom websocket={mockWebSocketClient}/>);

        const sendButton = screen.getByText('发送');

        expect(sendButton).toBeDisabled(); // 禁用发送按钮.
    });
});
