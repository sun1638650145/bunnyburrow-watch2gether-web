import PropTypes from 'prop-types';
import React from 'react';

/**
 * LoginPage组件, 用于渲染登录页面.
 * @param {Object} user - 登录用户信息.
 * @param {function} onUserChange - 登录用户信息的变化事件函数.
 * @param {function} onIsLoggedInClick - 点击登录按钮的事件函数.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <LoginPage
 *     user={user}
 *     onUserChange={handleUserChange}
 *     onIsLoggedInClick={handleIsLoggedInClick}
 * />
 */
export default function LoginPage({user, onUserChange, onIsLoggedInClick}) {
    return (
        <div className='login'>
            <input
                value={user.name}
                onChange={onUserChange}
                placeholder='请输入昵称'
            />
            <button onClick={onIsLoggedInClick}>加入</button>
        </div>
    );
}

LoginPage.propTypes = {
    user: PropTypes.object.isRequired,
    onUserChange: PropTypes.func.isRequired,
    onIsLoggedInClick: PropTypes.func.isRequired
};
