import React from 'react';
import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';

import LoginPage from '../components/login-page/login-page.jsx';
import {FriendsProvider} from '../contexts/friends-context.jsx';
import {UserProvider} from '../contexts/user-context.jsx';
import {StreamingProvider} from '../contexts/streaming-context.jsx';
import {WebSocketProvider} from '../contexts/websocket-context.jsx';

const mockHandleLoginClick = jest.fn();

describe('LoginPage', () => {
    beforeEach(() => {
        // 渲染登录页面.
        render(
            <UserProvider>
                <FriendsProvider>
                    <StreamingProvider>
                        <WebSocketProvider>
                            <LoginPage onLoginClick={mockHandleLoginClick}/>
                        </WebSocketProvider>
                    </StreamingProvider>
                </FriendsProvider>
            </UserProvider>
        );
    });

    test('上传不合法头像, 昵称为空, 流媒体视频源和WebSocket服务地址不合法时', async () => {
        const file = new File([''], 'file', {type: 'text/plain'});

        // 模拟用户上传头像, 并执行登录操作.
        await userEvent.upload(document
            .querySelector('#avatar-file-input'), file);
        await userEvent.click(screen.getByText('加入'));

        // 断言.
        expect(screen.getByText('请选择图片重新上传!')).toBeInTheDocument();
        await userEvent.click(screen.getByText('×')); // 关闭模态框.
        expect(screen.queryByText('请选择图片重新上传!')).not.toBeInTheDocument();

        expect(screen.getByText('昵称不能为空, 请输入昵称并重试.')).toBeInTheDocument();
        expect(screen.getByText('流媒体视频源为空或者不合法, 请重新输入视频源并重试.'))
            .toBeInTheDocument();
        expect(screen.getByText('WebSocket服务地址为空或者不合法, 请重新输入地址并重试.'))
            .toBeInTheDocument();
        expect(mockHandleLoginClick).toBeCalledTimes(0); // 加入按钮函数没有被调用.
    });

    test('成功加入时', async () => {
        const file = new File([''], 'avatar.png', {type: 'image/png'});

        // 模拟用户上传头像以及输入信息, 并执行登录操作.
        await userEvent.upload(document
            .querySelector('#avatar-file-input'), file);
        await userEvent.type(screen.getByPlaceholderText('请输入昵称'), 'Bot');
        await userEvent.type(screen
            .getByPlaceholderText('请输入流媒体视频源'), 'https://example.com/video/');
        await userEvent.type(screen
            .getByPlaceholderText('请输入WebSocket服务地址'), 'ws://example.com/ws/');
        await userEvent.click(screen.getByText('加入'));

        // 断言.
        expect(mockHandleLoginClick).toBeCalledTimes(1); // 加入按钮函数被调用.
    });
});
