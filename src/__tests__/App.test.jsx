import React from 'react';
import {describe, expect, test} from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import {fireEvent, render, screen} from '@testing-library/react';

import App from '../App.jsx';

describe('App', () => {
    test('正确渲染登录页面', () => {
        const {container} = render(<App/>);

        const loginButton = screen.getByText('加入');
        // eslint-disable-next-line
        const videoChatContainer = container.querySelector('.video-chat-container');

        expect(loginButton).toBeInTheDocument();
        expect(videoChatContainer).toBe(null); // 不存在播放器和ChatRoom容器.
    });

    test('正确渲染播放器和ChatRoom容器', () => {
        const {container} = render(<App/>);

        const loginInput = container.querySelector('.login-input');
        const streamInput = container.querySelector('.stream-input');
        const websocketInput = container.querySelector('.websocket-input');
        const loginButton = screen.getByText('加入');

        fireEvent.change(loginInput, {
            target: {value: 'Steve'}
        });
        fireEvent.change(streamInput, {
            target: {
                value: 'https://example.com/video/video.m3u8'
            }
        });
        fireEvent.change(websocketInput, {
            target: {
                value: 'wss://example.com/ws/'
            }
        });
        fireEvent.click(loginButton);

        // eslint-disable-next-line
        const videoChatContainer = container.querySelector('.video-chat-container');
        expect(videoChatContainer).toBeInTheDocument();
    });
});
