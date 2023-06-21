import PropTypes from 'prop-types';
import React from 'react';

import '../styles/avatar-upload.css';

/**
 * 用户头像组件, 用于上传并渲染用户头像.
 * @param {string} avatar - 用户头像的URL.
 * @param onAvatarChange - 用户头像URL的变化事件函数.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <AvatarUpload
 *     avatar='https://example.com/example.png'
 *     onAvatarChange={handleAvatarChange}
 * />
 */
export default function AvatarUpload({avatar, onAvatarChange}) {
    return (
        <div>
            {avatar ? (
                <img
                    className='avatar'
                    src={avatar}
                    alt='avatar'
                />
            ): (
                <form>
                    <input
                        type='file'
                        onChange={onAvatarChange}
                    />
                </form>
            )}
        </div>
    );
}

AvatarUpload.propTypes = {
    avatar: PropTypes.string.isRequired,
    onAvatarChange: PropTypes.func.isRequired
};
