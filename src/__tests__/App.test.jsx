import React from 'react';
import {describe, expect, test} from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import {fireEvent, render, screen} from '@testing-library/react';

import App from '../App.jsx';

describe('App', () => {
    test('正确渲染登录页面', () => {
        const {container} = render(<App/>);

        const loginButton = screen.getByText('加入');
        const homePage = container.querySelector('.home');

        expect(loginButton).toBeInTheDocument();
        expect(homePage).toBe(null); // 不渲染主页.
    });

    test('正确渲染播放器和ChatRoom容器', () => {
        const {container} = render(<App/>);

        const fileInput = container.querySelector('#file-input');
        const loginInput = container.querySelector('.login-input');
        const streamInput = container.querySelector('.stream-input');
        const websocketInput = container.querySelector('.websocket-input');
        const loginButton = screen.getByText('加入');

        fireEvent.change(fileInput, {
            target: {
                files: [new File([''], 'example.png', {type: 'image/png'})]
            }
        });
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

        const homePage = container.querySelector('.home');
        expect(homePage).toBeInTheDocument();
    });
});
