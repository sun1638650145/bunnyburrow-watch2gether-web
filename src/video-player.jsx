import PropTypes from 'prop-types';
import React, {createContext, useContext, useEffect, useRef} from 'react';
import videojs from 'video.js';

import 'video.js/dist/video-js.css';

// 传递播放器事件回调函数.
const ReadyContext = createContext(() => {});
// 传递流媒体视频源.
const SourcesContext = createContext({
    src: '',
    type: ''
});

/**
 * 封装VideoJS播放器.
 */
function VideoJSWrapper() {
    const playerRef = useRef(null);
    const videoRef = useRef(null);

    const onReady = useContext(ReadyContext);
    const sources = useContext(SourcesContext);

    useEffect(() => {
        // 确保播放器只初始化一次.
        if (!playerRef.current) {
            // 在React 18严格模式下Video.js播放器需要作为组件子元素.
            const videoElement = document.createElement('video-js');
            videoRef.current.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, {
                controls: true,
                fluid: true,
                playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
                preload: 'auto', // 移动设备可能收到带宽影响.
                sources: sources
            }, () => {
                onReady && onReady(player);
            });
        }
    }, []);

    // 卸载播放器.
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    return (
        <div ref={videoRef}/>
    );
}

/**
 * VideoPlayer组件, 播放流媒体视频, 同时创建WebSocket客户端连接和其他用户同步视频播放状态.
 * @param {Object} sources - 流媒体视频的URL和媒体类型(MIME types).
 * @param {WebSocketClient} websocket - WebSocket客户端.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <VideoPlayer
 *     sources={{
 *         src: 'https://example.com/video/video_name/',
 *         type: 'application/x-mpegURL'
 *     }}
 *     ws_url={new WebSocketClient('wss://example.com/ws/')}
 * />
 */
export default function VideoPlayer({sources, websocket}) {
    const playerRef = useRef(null);

    /**
     * 当播放器初始化完成, 用于处理播放器事件回调函数: 播放/暂停操作, 修改播放倍速和播放进度,
     * 并且接收其他用户发送的同步视频播放状态.
     * @param {Player} player - Video.js播放器实例.
     */
    function handlePlayerReady(player) {
        playerRef.current = player;
        websocket.initPlayer(player); // 初始化Video.js播放器.

        // 初次加载视频时的大播放按钮.
        player.bigPlayButton.on(['click', 'touchend'], () => {
            websocket.sendMessage('play', 'command');
        });
        // 播放/暂停按钮.
        player.controlBar.playToggle.on(['click', 'touchend'], () => {
            if (player.paused()) {
                websocket.sendMessage('pause', 'command');
            } else {
                websocket.sendMessage('play', 'command');
            }
        });
        // 倍速按钮.
        // TODO(Steve): 通过事件触发修改播放倍速会导致发送两次信息.
        player.on('ratechange', () => {
            websocket.sendMessage({
                'playbackRate': player.playbackRate()
            }, 'command');
        });
        // 进度条.
        player.controlBar.progressControl.seekBar.on('click', () => {
            websocket.sendMessage({
                'newProgress': player.currentTime()
            }, 'command');
        });
    }

    return (
        <SourcesContext.Provider value={sources}>
            <ReadyContext.Provider value={handlePlayerReady}>
                <VideoJSWrapper/>
            </ReadyContext.Provider>
        </SourcesContext.Provider>
    );
}

VideoPlayer.propTypes = {
    sources: PropTypes.object.isRequired,
    websocket: PropTypes.object.isRequired
};
