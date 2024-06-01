import {afterAll, describe, expect, test} from '@jest/globals';
import {WebSocketServer} from 'ws';

import WebSocketClient from '../websockets/websocket.js';

const friends = [
    {avatar: 'https://example.com/avatar1.png', clientID: 2023, name: 'Bot'},
    {avatar: 'https://example.com/avatar2.png', clientID: 2024, name: 'Foo'},
    {avatar: 'https://example.com/avatar3.png', clientID: 2025, name: 'Bar'}
];

// 创建并启动WebSocket服务.
const webSocketServer = new WebSocketServer({port: 8000});
webSocketServer.on('connection', (socket) => {
    socket.on('message', async (message) => {
        const data = await JSON.parse(message);
        const props = data.props;
        const receivedClientID = props.receivedClientID || -1;

        // 对工作类型进行判断.
        if (props.type === 'websocket.unicast' && receivedClientID > 0) {
            // TODO: 暂未实现.
        } else {
            webSocketServer.clients.forEach(client => {
                // 避免广播风暴.
                if (client !== socket && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });
});

describe('WebSocketClient', () => {
    test('发送并接收聊天消息', (done) => {
        /* eslint-disable max-len */
        const senderClient = new WebSocketClient('ws://127.0.0.1:8000/ws/', friends[0]);
        const receiverClient1 = new WebSocketClient('ws://127.0.0.1:8000/ws/', friends[1]);
        const receiverClient2 = new WebSocketClient('ws://127.0.0.1:8000/ws/', friends[2]);
        /* eslint-enable */

        let sendOpen = false;
        let receiveOpen1 = false;
        let receiveOpen2 = false;

        /**
         * 发送聊天消息函数.
         */
        function sendMessage() {
            if (sendOpen && receiveOpen1 && receiveOpen2) {
                // 第一个客户端发送聊天消息.
                senderClient.broadcast({
                    action: 'chat',
                    message: 'Hello, World!',
                    user: {
                        clientID: senderClient.user.clientID
                    }
                });
            }
        }

        senderClient.socket.onopen = () => {
            sendOpen = true;
            sendMessage();
        };

        receiverClient1.socket.onopen = () => {
            receiveOpen1 = true;
            sendMessage();
        };

        receiverClient2.socket.onopen = () => {
            receiveOpen2 = true;
            sendMessage();
        };

        let receivedMessages = 0;

        /**
         * 断开所有WebSocket客户端与服务器的连接.
         */
        function closeAll() {
            receivedMessages += 1;

            if (receivedMessages === 2) {
                senderClient.close();
                receiverClient1.close();
                receiverClient2.close();

                done();
            }
        }

        // 两个客户端接收聊天消息.
        receiverClient1.on('receiveMessage', (message, clientID) => {
            // 断言.
            expect(message).toBe('Hello, World!');
            expect(clientID).toBe(senderClient.user.clientID);

            closeAll();
        });
        receiverClient2.on('receiveMessage', (message, clientID) => {
            // 断言.
            expect(message).toBe('Hello, World!');
            expect(clientID).toBe(senderClient.user.clientID);

            closeAll();
        });
    });

    afterAll(() => {
        webSocketServer.close();
    });
});
