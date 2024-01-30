import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'react-modal';

// 清空模态框的默认样式.
Modal.defaultStyles = {};
// 绑定模态框到App元素上.
Modal.setAppElement('body');

/**
 * 视频播放器模态框组件.
 * @param {boolean} isOpen 视频播放器模态框开关.
 * @param {string} message 视频播放器模态框显示的信息.
 * @returns {React.ReactElement}
 * @constructor
 */
export default function VideoPlayerModal({isOpen, message}) {
    return (
        <Modal className='video-player-modal' isOpen={isOpen}>
            {message}
        </Modal>
    );
}

VideoPlayerModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired
};
