import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'react-modal';

// 清空模态框的默认样式.
Modal.defaultStyles = {};
// 绑定模态框到App元素上.
Modal.setAppElement('body');

/**
 * 上传错误模态框组件.
 * @param {boolean} isOpen 上传错误模态框开关.
 * @param {function} closeModal 关闭上传错误模态框回调函数.
 * @returns {React.ReactElement}
 * @constructor
 */
export default function UploaderModal({isOpen, closeModal}) {
    return (
        <Modal className='uploader-modal' isOpen={isOpen}>
            <div className='message'>请选择图片重新上传!</div>
            <button className='close-button' onClick={closeModal}>×</button>
        </Modal>
    );
}

UploaderModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired
};
