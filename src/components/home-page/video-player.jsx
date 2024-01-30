import PropTypes from 'prop-types';
import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import videojs from 'video.js';

import VideoPlayerModal from './video-player-modal.jsx';
import {FriendsContext} from '../../contexts/friends-context.jsx';
import {StreamingContext} from '../../contexts/streaming-context.jsx';
import {UserContext} from '../../contexts/user-context.jsx';
import {WebSocketContext} from '../../contexts/websocket-context.jsx';

import zh from 'video.js/dist/lang/zh-Hans.json';

import 'video.js/dist/video-js.css';

/**
 * 用于封装VideoJS播放器.
 * @param {function} onReady 播放器准备就绪回调函数.
 * @returns {React.ReactElement}
 * @constructor
 */
function VideoJSWrapper({onReady}) {
    // 使用流媒体视频源Context.
    const {streaming} = useContext(StreamingContext);
    // 播放器引用ref.
    const playerRef = useRef(null);
    // 播放器DOM元素引用ref.
    const videoRef = useRef(null);

    useEffect(() => {
        // 确保播放器只初始化一次.
        if (!playerRef.current) {
            // 在React 18严格模式下播放器需要作为组件子元素.
            const videoElement = document.createElement('video-js');
            videoRef.current.appendChild(videoElement);

            // 添加简体中文语言包.
            videojs.addLanguage('zh-Hans', zh);

            const player = playerRef.current = videojs(videoElement, {
                aspectRatio: '16:9',
                controlBar: {
                    skipButtons: {
                        backward: 30,
                        forward: 30
                    }
                },
                controls: true,
                playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
                preload: 'auto', // 移动设备可能受到带宽影响.
                sources: [{
                    src: streaming.url,
                    type: streaming.type
                }]
            }, () => {
                onReady && onReady(player);
            });
        }

    }, [streaming, videoRef]);

    // 卸载组件时销毁播放器.
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div className='video-player' ref={videoRef}/>
    );
}

/**
 * 视频播放器组件, 用于播放流媒体视频并与其他用户同步播放状态.
 * @returns {React.ReactElement}
 * @constructor
 */
export default function VideoPlayer() {
    // 使用好友列表Context.
    const {friends} = useContext(FriendsContext);
    // 使用用户信息Context.
    const {user} = useContext(UserContext);
    // 使用WebSocket服务Context.
    const {websocketClient} = useContext(WebSocketContext);

    // 好友列表引用ref.
    const friendsRef = useRef(friends);

    // 控制模态框开关变量.
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // 模态框显示的信息变量.
    const [modalMessage, setModalMessage] = useState('');

    /**
     * 处理播放器准备就绪函数.
     * @param {Player} player VideoJS播放器实例.
     */
    function handlePlayerReady(player) {
        /**
         * 接收播放器状态同步.
         * @param {string|Object} command 状态同步命令字段.
         */
        function receivePlayerSync(command) {
            if (command === 'play') {
                // 播放视频.
                player.play().then();
            } else if (command === 'pause') {
                // 暂停视频.
                player.pause();
            } else if (command.newProgress) {
                // 修改播放进度.
                player.currentTime(command.newProgress);
            } else if (command.playbackRate) {
                // 调整播放速率.
                player.playbackRate(command.playbackRate);
            }
        }

        /**
         * 发送播放器状态同步.
         * @param {string|Object} command 状态同步命令字段.
         */
        function sendPlayerSync(command) {
            websocketClient.broadcast({
                action: 'player',
                command: command,
                user: {
                    // 只发送客户端ID以减小网络开销.
                    clientID: user.clientID
                }
            });
        }

        /**
         * 显示视频播放器模态框.
         * @param {string|Object} command 状态同步命令字段.
         * @param {number} clientID 用户的客户端ID.
         */
        function showModal(command, clientID) {
            setModalIsOpen(true);
            // 从好友列表引用中获取用户信息.
            const friend = friendsRef.current.get(clientID);

            if (command === 'play') {
                setModalMessage(`用户${friend.name}播放了当前内容.`);
            } else if (command === 'pause') {
                setModalMessage(`用户${friend.name}暂停了当前内容.`);
            } else if (command.newProgress) {
                setModalMessage(`用户${friend.name}修改了播放进度.`);
            } else if (command.playbackRate) {
                setModalMessage(`用户${friend.name}调整了播放速率.`);
            }

            // 设置模态框1000ms后自动关闭.
            setTimeout(() => {
                setModalIsOpen(false);
                setModalMessage('');
            }, 1000);
        }

        websocketClient.on('receivePlayerSync', receivePlayerSync);
        websocketClient.on('showModal', showModal);

        // 禁用打开上下文菜单.
        player.on('contextmenu', (e) => {
            e.preventDefault();
        });

        // 大播放按钮.
        player.bigPlayButton.on(['click', 'touchend'], () => {
            sendPlayerSync('play');
        });

        // 快退按钮.
        player.controlBar.skipBackward.on(['click', 'touchend'], () => {
            sendPlayerSync({newProgress: player.currentTime()});
        });

        // 播放控制按钮.
        player.controlBar.playToggle.on(['click', 'touchend'], () => {
            sendPlayerSync( player.paused() ? 'pause' : 'play');
        });

        // 快进按钮.
        player.controlBar.skipForward.on(['click', 'touchend'], () => {
            sendPlayerSync({newProgress: player.currentTime()});
        });

        // 进度条.
        player.controlBar.progressControl.on(['mouseup', 'touchend'], () => {
            sendPlayerSync({newProgress: player.currentTime()});
        });

        // 播放速率按钮.
        const menuButtons =
            player.controlBar.playbackRateMenuButton.menu.children();
        menuButtons.forEach(button => {
            button.on(['click', 'touchend'], () => {
                sendPlayerSync({playbackRate: button.rate});
            });
        });
    }

    // 好友列表变化时, 更新好友列表引用.
    useEffect(() => {
        friendsRef.current = friends;
    }, [friends]);

    return (
        <Fragment>
            <VideoJSWrapper onReady={handlePlayerReady}/>
            <VideoPlayerModal isOpen={modalIsOpen} message={modalMessage}/>
        </Fragment>
    );
}

VideoJSWrapper.propTypes = {
    onReady: PropTypes.func.isRequired
};
