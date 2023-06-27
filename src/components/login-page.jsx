import PropTypes from 'prop-types';
import React, {useState} from 'react';

import AvatarUpload from './avatar-upload.jsx';

import '../styles/login-page.css';

/**
 * LoginPage组件, 用于渲染登录页面.
 * @param {Object} user - 登录用户信息.
 * @param {Object} sources - 流媒体视频源(包括URL和媒体类型(MIME types)).
 * @param {string} webSocketUrl - WebSocket服务器的URL.
 * @param {function} onUserAvatarChange - 登录用户头像URL的变化事件函数.
 * @param {function} onUserNameChange - 登录用户昵称的变化事件函数.
 * @param {function} onSourcesSrcChange - 流媒体视频源的变化事件函数.
 * @param {function} onWebSocketUrlChange - WebSocket服务器URL的变化事件函数.
 * @param {function} onIsLoggedInClick - 点击登录按钮的事件函数.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <LoginPage
 *     user={user}
 *     sources={sources}
 *     webSocketUrl={webSocketUrl}
 *     onUserAvatarChange={handleUserAvatarChange}
 *     onUserNameChange={handleUserNameChange}
 *     onSourcesSrcChange={handleSourcesSrcChange}
 *     onWebSocketUrlChange={handleWebSocketUrlChange}
 *     onIsLoggedInClick={handleIsLoggedInClick}
 * />
 */
export default function LoginPage({
    user,
    sources,
    webSocketUrl,
    onUserAvatarChange,
    onUserNameChange,
    onSourcesSrcChange,
    onWebSocketUrlChange,
    onIsLoggedInClick
}) {
    // 登录错误.
    const [loginError, setLoginError] = useState(false);
    // 流媒体地址错误.
    const [streamError, setStreamError] = useState(false);

    /**
     * 判断是不是合法的http(s)地址.
     * @param {string} url - 输入的URL.
     * @returns {boolean}
     */
    function isValidHttp(url) {
        // TODO(Steve): 这里只检查了协议类型, 应该做更加完整地址检查.
        const pattern = new RegExp('^https?:\\/\\/');

        return pattern.test(url);
    }

    /**
     * 处理登录事件, 判断用户昵称和流媒体地址是否合法.
     */
    function handleClick() {
        if (user.name.trim() === '') {
            setLoginError(true);
        } else if (!isValidHttp(sources.src.trim())) {
            setStreamError(true);
        } else {
            onIsLoggedInClick();
        }
    }

    return (
        <div className='login'>
            <h1>一起看电影</h1>
            <AvatarUpload
                avatar={user.avatar}
                onAvatarChange={onUserAvatarChange}
            />
            <input
                className={`login-input ${loginError? 'error': ''}`}
                value={user.name}
                onChange={onUserNameChange}
                placeholder='请输入昵称'
            />
            {loginError && <div className='login-error-message'>
                昵称不能为空, 请输入昵称并重试.
            </div>}
            <input
                className={`stream-input ${streamError? 'error': ''}`}
                value={sources.src}
                onChange={onSourcesSrcChange}
                placeholder='请输入流媒体服务器地址'
            />
            {streamError && <div className='stream-error-message'>
                流媒体服务器地址为空或者不合法, 请重新输入地址并重试.
            </div>}
            <input
                value={webSocketUrl}
                onChange={onWebSocketUrlChange}
                placeholder='请输入WebSocket服务器地址'
            />
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
    user: PropTypes.object.isRequired,
    sources: PropTypes.object.isRequired,
    webSocketUrl: PropTypes.string.isRequired,
    onUserAvatarChange: PropTypes.func.isRequired,
    onUserNameChange: PropTypes.func.isRequired,
    onSourcesSrcChange: PropTypes.func.isRequired,
    onWebSocketUrlChange: PropTypes.func.isRequired,
    onIsLoggedInClick: PropTypes.func.isRequired
};
