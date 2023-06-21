import PropTypes from 'prop-types';
import React, {useState} from 'react';

import AvatarUpload from './avatar-upload.jsx';

import '../styles/login-page.css';

/**
 * LoginPage组件, 用于渲染登录页面.
 * @param {Object} user - 登录用户信息.
 * @param {function} onUserAvatarChange - 登录用户头像URL的变化事件函数.
 * @param {function} onUserNameChange - 登录用户昵称的变化事件函数.
 * @param {function} onIsLoggedInClick - 点击登录按钮的事件函数.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <LoginPage
 *     user={user}
 *     onUserAvatarChange={handleUserAvatarChange}
 *     onUserNameChange={handleUserNameChange}
 *     onIsLoggedInClick={handleIsLoggedInClick}
 * />
 */
export default function LoginPage({
    user,
    onUserAvatarChange,
    onUserNameChange,
    onIsLoggedInClick
}) {
    // 登录错误.
    const [loginError, setLoginError] = useState(false);

    /**
     * 处理登录事件, 判断用户信息是否合法.
     */
    function handleClick() {
        if (user.name.trim() === '') {
            setLoginError(true);
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
    onUserAvatarChange: PropTypes.func.isRequired,
    onUserNameChange: PropTypes.func.isRequired,
    onIsLoggedInClick: PropTypes.func.isRequired
};
