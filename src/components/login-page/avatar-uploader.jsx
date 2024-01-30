import PropTypes from 'prop-types';
import React, {Fragment} from 'react';

/**
 * 头像上传组件, 用于上传并渲染头像.
 * @param {string} avatar 头像的Base64.
 * @param {function} onAvatarUpload 头像上传回调函数.
 * @returns {React.ReactElement}
 * @constructor
 */
export default function AvatarUploader({avatar, onAvatarUpload}) {
    return (
        <Fragment>
            {avatar ? (
                <div
                    className='avatar'
                    style={{ backgroundImage: `url(${avatar})` }}
                />
            ) : (
                <Fragment>
                    <input
                        id="avatar-file-input"
                        type='file'
                        onChange={onAvatarUpload}
                    />
                    <label
                        className='custom-avatar-file-input'
                        htmlFor='avatar-file-input'
                    />
                </Fragment>
            )}
        </Fragment>
    );
}

AvatarUploader.propTypes = {
    avatar: PropTypes.string.isRequired,
    onAvatarUpload: PropTypes.func.isRequired
};
