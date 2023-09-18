import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'react-modal';

import '../styles/video-player-modal.css';

// 禁用模态框的默认样式.
Modal.defaultStyles = {};
// 绑定模态框到video-js.
Modal.setAppElement(document.getElementById('video-js'));

/**
 * VideoPlayerModal组件, 为播放器创建模态框.
 * @param {boolean} isOpen - 控制模态框开关.
 * @param {string} message - 模态框显示的信息.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <VideoPlayerModal isOpen={true} message='Hello, World!'/>
 */
export default function VideoPlayerModal({isOpen, message}) {
    return (
        <Modal
            className='video-player-modal'
            isOpen={isOpen}
        >
            {message}
        </Modal>
    );
}

VideoPlayerModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired
};
