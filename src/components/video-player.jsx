import PropTypes from 'prop-types';
import React, {useContext, useEffect, useRef, useState} from 'react';
import videojs from 'video.js';

import VideoPlayerModal from './video-player-modal.jsx';
import {ReadyContext, SourcesContext, UserContext} from '../contexts.js';
import WebSocketClient from '../websocket.js';

import zh from 'video.js/dist/lang/zh-Hans.json';

import 'video.js/dist/video-js.css';
import '../styles/video-player.css';

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

            // 添加简体中文语言包.
            videojs.addLanguage('zh-Hans', zh);

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

    // 卸载Video.js播放器.
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
        <div className='video-player' ref={videoRef}/>
    );
}

/**
 * VideoPlayer组件, 播放流媒体视频, 与其他用户同步视频播放状态.
 * @param {Object} sources - 流媒体视频源(包括URL和媒体类型(MIME types)).
 * @param {WebSocketClient} websocket - WebSocket客户端.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <VideoPlayer
 *     sources={{
 *         src: 'https://example.com/video/video_name/',
 *         type: 'application/x-mpegURL'
 *     }}
 *     websocket={new WebSocketClient('wss://example.com/ws/')}
 * />
 */
export default function VideoPlayer({sources, websocket}) {
    const playerRef = useRef(null);
    // 用户信息.
    const user = useContext(UserContext);
    // 播放器模态框控制开关和内容.
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    /**
     * 当播放器初始化完成, 用于处理播放器事件回调函数: 播放/暂停操作, 修改播放倍速和播放进度.
     * @param {Player} player - Video.js播放器实例.
     */
    function handlePlayerReady(player) {
        playerRef.current = player;
        websocket.setPlayer(player); // WebSocket客户端设置Video.js播放器.

        // 初次加载视频时的大播放按钮.
        player.bigPlayButton.on(['click', 'touchend'], () => {
            websocket.sendMessage({
                user: user,
                command: 'play'
            }, 'command');
        });
        // 播放/暂停按钮.
        player.controlBar.playToggle.on(['click', 'touchend'], () => {
            if (player.paused()) {
                websocket.sendMessage({
                    user: user,
                    command: 'pause'
                }, 'command');
            } else {
                websocket.sendMessage({
                    user: user,
                    command: 'play'
                }, 'command');
            }
        });
        // 倍速菜单的全部按钮.
        const menuItems =
            player.controlBar.playbackRateMenuButton.menu.children();
        for (let i = 0; i < menuItems.length; i++) {
            // 遍历全部按钮获取每个倍速的按钮.
            const menuItem = menuItems[i];

            menuItem.on(['click', 'touchend'], () => {
                websocket.sendMessage({
                    user: user,
                    command: {
                        playbackRate: menuItem.rate
                    }
                }, 'command');
            });
        }
        // 进度条.
        player.controlBar.progressControl.seekBar.on('click', () => {
            websocket.sendMessage({
                user: user,
                command: {
                    newProgress: player.currentTime()
                }
            }, 'command');
        });
    }

    // 打开播放器模态框和添加内容.
    useEffect(() => {
        websocket.setVideoPlayerModalMessageHandler(modalMessage => {
            setModalIsOpen(true);
            setModalMessage(modalMessage);
        });
    }, []);

    // 设置播放器模态框1000ms后自动关闭.
    useEffect(() => {
        if (modalIsOpen) {
            const timerID = setTimeout(() => {
                setModalIsOpen(false);
            }, 1000);

            return () => clearTimeout(timerID); // 清除定时器以防止内存泄漏.
        }
    }, [modalIsOpen]);

    return (
        <SourcesContext.Provider value={sources}>
            <ReadyContext.Provider value={handlePlayerReady}>
                <VideoJSWrapper/>
                <VideoPlayerModal isOpen={modalIsOpen} message={modalMessage}/>
            </ReadyContext.Provider>
        </SourcesContext.Provider>
    );
}

VideoPlayer.propTypes = {
    sources: PropTypes.object.isRequired,
    websocket: PropTypes.instanceOf(WebSocketClient).isRequired
};
