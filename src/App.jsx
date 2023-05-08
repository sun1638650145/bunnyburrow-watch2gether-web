import React from 'react';

import VideoPlayer from './video-player.jsx';
import WebSocketClient from './websocket.js';

export default function App() {
    const sources = {
        src: 'http://192.168.31.147:8000/video/我们亲爱的Steve/',
        type: 'application/x-mpegURL'
    };
    const websocket = new WebSocketClient('ws://192.168.31.147:8000/ws/');

    return (
        <VideoPlayer sources={sources} websocket={websocket}/>
    );
}
