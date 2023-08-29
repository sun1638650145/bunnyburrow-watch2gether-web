import React from 'react';
import {describe, expect, jest, test} from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import {render} from '@testing-library/react';

import VideoPlayer from '../../components/video-player.jsx';
import WebSocketClient from '../../websocket';

// 模拟WebSocketClient模块.
jest.mock('../../websocket.js');

describe('VideoPlayer', () => {
    test('正确渲染播放器', () => {
        const sources = {
            src: 'https://example.com/video/video.m3u8',
            type: 'application/x-mpegURL'
        };
        const mockWebSocketClient = new WebSocketClient('ws://example.com/ws/');
        const {container} = render(
            <VideoPlayer sources={sources} websocket={mockWebSocketClient}/>
        );

        const videoPlayer = container.querySelector('.video-player');

        expect(videoPlayer).toBeInTheDocument();
    });
});
