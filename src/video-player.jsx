import PropTypes from 'prop-types';
import React, {createContext, useContext, useEffect, useRef} from 'react';
import videojs from 'video.js';

import 'video.js/dist/video-js.css';

// 传递播放器事件回调函数.
const readyContext = createContext(() => {});
// 传递流媒体视频源.
const sourcesContext = createContext({
    src: '',
    type: ''
});

/**
 * 封装VideoJS播放器.
 */
function VideoJSWrapper() {
    const playerRef = useRef(null);
    const videoRef = useRef(null);

    const onReady = useContext(readyContext);
    const sources = useContext(sourcesContext);

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
 * @param {String} ws_url - WebSocket服务器的URL.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <VideoPlayer
 *     sources={{
 *         src: 'https://example.com/video/video_name/',
 *         type: 'application/x-mpegURL'
 *     }}
 *     ws_url={'wss://example.com/ws/'}
 * />
 */
export default function VideoPlayer({sources, ws_url}) {
    const playerRef = useRef(null);
    const websocketRef = useRef(null);

    /**
     * 当播放器初始化完成, 用于处理播放器事件回调函数: 播放/暂停操作, 修改播放倍速和播放进度.
     * @param {Player} player - Video.js播放器实例.
     */
    function handlePlayerReady(player) {
        playerRef.current = player;
        const websocket = websocketRef.current = new WebSocket(ws_url);

        // 初次加载视频时的大播放按钮.
        player.bigPlayButton.on(['click', 'touchend'], () => {
            sendMessage(websocket, 'play');
        });
        // 播放/暂停按钮.
        player.controlBar.playToggle.on(['click', 'touchend'], () => {
            if (player.paused()) {
                sendMessage(websocket, 'pause');
            } else {
                sendMessage(websocket, 'play');
            }
        });
        // 倍速按钮.
        // TODO(Steve): 通过事件触发修改播放倍速会导致发送两次信息.
        player.on('ratechange', () => {
            sendMessage(websocket, {
                'playbackRate': player.playbackRate()
            });
        });
        // 进度条.
        player.controlBar.progressControl.seekBar.on('click', () => {
            sendMessage(websocket, {
                'newProgress': player.currentTime()
            });
        });

        websocket.onmessage = (e) => {
            const msg = JSON.parse(e.data)['msg'];

            if (msg === 'play') {
                player.play().then();
                console.log('收到服务器: 开始');
            } else if (msg === 'pause') {
                player.pause();
                console.log('收到服务器: 暂停');
            } else if (msg.playbackRate) {
                player.playbackRate(msg.playbackRate);
                console.log(`收到服务器: ${msg.playbackRate}x 倍速`);
            } else if (msg.newProgress) {
                player.currentTime(msg.newProgress);
                console.log(`收到服务器: 更新进度到 ${msg.newProgress} 秒`);
            }
        };
    }

    /**
     * 发送信息给WebSocket服务器.
     * @param {WebSocket} websocket - 一个websocket客户端链接.
     * @param {String|Object} msg - 发送的信息: 播放/暂停操作, 修改播放倍速和播放进度.
     */
    function sendMessage(websocket, msg) {
        websocket.send(JSON.stringify({
            'msg': msg
        }));

        if (msg === 'play') {
            console.log('客户端发送: 开始');
        } else if (msg === 'pause') {
            console.log('客户端发送: 暂停');
        } else if (msg.playbackRate) {
            console.log(`客户端发送: ${msg.playbackRate}x 倍速`);
        } else if (msg.newProgress) {
            console.log(`客户端发送: 更新进度到 ${msg.newProgress} 秒`);
        }
    }

    return (
        <sourcesContext.Provider value={sources}>
            <readyContext.Provider value={handlePlayerReady}>
                <VideoJSWrapper/>
            </readyContext.Provider>
        </sourcesContext.Provider>
    );
}

VideoPlayer.propTypes = {
    sources: PropTypes.object.isRequired,
    ws_url: PropTypes.string.isRequired
};
