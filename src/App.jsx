import React from 'react';

import VideoPlayer from './video-player.jsx';

export default function App() {
    const sources = {
        src: 'http://192.168.31.147:8000/video/我们亲爱的Steve',
        type: 'application/x-mpegURL'
    };

    return (
        <VideoPlayer sources={sources}/>
    );
}
