import PropTypes from 'prop-types';
import React from 'react';

import '../styles/avatar-upload.css';

/**
 * 用户头像组件, 用于上传并渲染用户头像.
 * @param {string} avatar - 用户头像的URL.
 * @param {function} onAvatarChange - 用户头像URL的变化事件函数.
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
                <div
                    className='avatar'
                    role='img'
                    style={{ backgroundImage: `url(${avatar})` }}
                />
            ): (
                <div className='avatar-input'>
                    <input
                        id='file-input'
                        type='file'
                        onChange={onAvatarChange}
                    />
                    <label
                        className='custom-file-input'
                        htmlFor='file-input'
                    >+</label>
                </div>
            )}
        </div>
    );
}

AvatarUpload.propTypes = {
    avatar: PropTypes.string.isRequired,
    onAvatarChange: PropTypes.func.isRequired
};
