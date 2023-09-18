import React from 'react';
import {describe, jest, test} from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import {render, screen} from '@testing-library/react';

import UsersPanel from '../../components/users-panel.jsx';
import WebSocketClient from '../../websocket.js';

// 模拟WebSocketClient模块.
jest.mock('../../websocket.js');

describe('UsersPanel', () => {
    test('正确渲染全部在线用户', () => {
        const user = {name: 'Steve'};
        const mockWebSockClient = new WebSocketClient(
            'wss://example.com/ws/', user);
        render(<UsersPanel websocket={mockWebSockClient}/>);

        const OnlineUsers = screen.getByText('在线用户: 1');

        expect(OnlineUsers).toBeInTheDocument();
    });
});
