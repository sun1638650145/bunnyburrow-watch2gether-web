import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';

import AvatarUploader from './avatar-uploader.jsx';
import UploaderModal from './uploader-modal.jsx';
import {FriendsContext} from '../../contexts/friends-context.jsx';
import {StreamingContext} from '../../contexts/streaming-context.jsx';
import {UserContext} from '../../contexts/user-context.jsx';
import {WebSocketContext} from '../../contexts/websocket-context.jsx';

import '../../styles/login-page/login-page.css';

/**
 * 登录页面组件.
 * @param {function|Mock} onLoginClick 点击加入按钮回调函数.
 * @returns {React.ReactElement}
 * @constructor
 */
export default function LoginPage({onLoginClick}) {
    // 使用用户信息Context.
    const {
        user, uploaderModalIsOpen,
        closeUploaderModal, handleAvatarUpload, handleNameChange
    } = useContext(UserContext);
    // 使用好友列表Context.
    const {addFriend, removeFriend} = useContext(FriendsContext);
    // 使用流媒体视频源Context.
    const {streaming, handleStreamingChange} = useContext(StreamingContext);
    // 使用WebSocket服务Context.
    const {
        initWebSocket,
        websocketUrl, handleWebSocketUrlChange
    } = useContext(WebSocketContext);

    // 昵称为空变量.
    const [isNameEmpty, setIsNameEmpty] = useState(false);
    // 流媒体视频源不合法变量.
    const [isStreamingInvalid, setIsStreamingInvalid] = useState(false);
    // WebSocket服务地址不合法变量.
    const [isWebSocketInvalid, setIsWebSocketInvalid] = useState(false);

    /**
     * 检查昵称不为空, 流媒体视频源和WebSocket服务地址合法后;
     * 处理点击加入按钮函数.
     */
    function handleClick() {
        const streamingPattern = new RegExp('^(http|https)://[^/\\s].*$');
        const webSocketPattern = new RegExp('^(ws|wss)://[^/\\s].*/ws/$');

        // 检查昵称是否为空.
        if (user.name.trim() === '') {
            setIsNameEmpty(true);
        } else {
            setIsNameEmpty(false);
        }

        // 检查流媒体视频源是否不合法.
        if (streamingPattern.test(streaming.url.trim()) === false) {
            setIsStreamingInvalid(true);
        } else {
            setIsStreamingInvalid(false);
        }

        // 检查WebSocket服务地址是否不合法.
        if (webSocketPattern.test(websocketUrl.trim()) === false) {
            setIsWebSocketInvalid(true);
        } else {
            setIsWebSocketInvalid(false);
        }

        if (user.name.trim() !== ''
            && streamingPattern.test(streaming.url.trim()) === true
            && webSocketPattern.test(websocketUrl.trim()) === true) {

            addFriend(user); // 添加自己的用户信息.
            initWebSocket(user, addFriend, removeFriend);
            onLoginClick();
        }
    }

    return (
        <div className='login-page'>
            <h1>一起看电影</h1>
            <AvatarUploader
                avatar={user.avatar}
                onAvatarUpload={handleAvatarUpload}
            />
            <UploaderModal
                isOpen={uploaderModalIsOpen}
                closeModal={closeUploaderModal}
            />
            <input
                className={`name-input ${isNameEmpty ? 'error' : ''}`}
                value={user.name}
                onChange={handleNameChange}
                placeholder='请输入昵称'
            />
            {isNameEmpty && <div className='error-message'>
                昵称不能为空, 请输入昵称并重试.
            </div>}
            <input
                className={
                    `streaming-url-input ${isStreamingInvalid ? 'error' : ''}`
                }
                value={streaming.url}
                onChange={handleStreamingChange}
                placeholder='请输入流媒体视频源'
                type='url'
            />
            {isStreamingInvalid && <div className='error-message'>
                流媒体视频源为空或者不合法, 请重新输入视频源并重试.
            </div>}
            <input
                className={
                    `websocket-url-input ${isWebSocketInvalid ? 'error' : ''}`
                }
                value={websocketUrl}
                onChange={handleWebSocketUrlChange}
                placeholder='请输入WebSocket服务地址'
                type='url'
            />
            {isWebSocketInvalid && <div className='error-message'>
                WebSocket服务地址为空或者不合法, 请重新输入地址并重试.
            </div>}
            <button
                className='login-button'
                onClick={handleClick}
            >
                加入
            </button>
        </div>
    );
}

LoginPage.propTypes = {
    onLoginClick: PropTypes.func.isRequired
};
