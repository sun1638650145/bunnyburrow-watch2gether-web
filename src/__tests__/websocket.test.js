import {describe, expect, test} from '@jest/globals';

import WebSocketClient from '../websocket.js';

describe('WebSocketClient', () => {
    test('发送和处理聊天内容', () => {
        let receivedData;
        const data = {
            user: {name: 'Steve'},
            content: 'Hello, World!'
        };
        const websocket = new WebSocketClient('wss://example.com/ws/');

        // 设置聊天内容处理函数.
        websocket.setChatListHandler(sendData => {
            receivedData = sendData;
        });

        // 模拟事件.
        const mockEvent = {
            data: JSON.stringify({
                data: data,
                type: 'chat'
            })
        };
        websocket.onMessage(mockEvent);

        expect(receivedData).toEqual(data);
    });
});
