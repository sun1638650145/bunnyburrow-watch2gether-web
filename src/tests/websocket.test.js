import {exec} from 'child_process';

import {afterAll, beforeAll, describe, expect, test} from '@jest/globals';

import WebSocketClient from '../websockets/websocket.js';

const friends = [
    {avatar: 'https://example.com/avatar1.png', clientID: 2023, name: 'Bot'},
    {avatar: 'https://example.com/avatar2.png', clientID: 2024, name: 'Foo'},
    {avatar: 'https://example.com/avatar3.png', clientID: 2025, name: 'Bar'}
];

let serverProcess;

describe('WebSocketClient', () => {
    beforeAll((done) => {
        // 启动WebSocket服务.
        serverProcess = exec('w2g-cli launch ~/w2g');
        // 等待WebSocket服务启动.
        setTimeout(done, 2000);
    });

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
        // 关闭WebSocket服务.
        serverProcess.kill();
    });
});
