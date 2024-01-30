import PropTypes from 'prop-types';
import React, {createContext, useState} from 'react';
import {useImmer} from 'use-immer';

/**
 * 用户信息Context值.
 * @typedef {Object} UserContextValue
 * @property {Object} user 用户信息.
 * @property {string} user.avatar 头像的Base64.
 * @property {number} user.clientID 客户端ID.
 * @property {string} user.name 昵称.
 * @property {function} closeUploaderModal 关闭头像上传错误模态框函数.
 * @property {function} handleAvatarUpload 处理头像上传函数.
 * @property {function} handleNameChange 处理输入昵称事件函数.
 */

/**
 * 用户信息Context.
 * @type {React.Context<UserContextValue>}
 */
export const UserContext = createContext({});

/**
 * 用户信息Context的Provider.
 * @param {React.ReactNode} children 子组件.
 * @returns {React.ReactNode}
 * @constructor
 */
export function UserProvider({children}) {
    // 用户信息.
    const [user, updateUser] = useImmer({
        avatar: '', // 头像的Base64.
        clientID: Date.now(), // 客户端ID. TODO(Steve): 目前使用时间戳生成, 未来改进为使用UUID.
        name: '' // 昵称.
    });
    // 控制头像上传错误模态框开关.
    const [uploaderModalIsOpen, setUploaderModalIsOpen] = useState(false);

    /**
     * 关闭头像上传错误模态框函数.
     */
    function closeUploaderModal() {
        setUploaderModalIsOpen(false);
    }

    /**
     * 处理头像上传函数.
     * @param {React.ChangeEvent<HTMLInputElement>} e 头像文件上传事件.
     */
    function handleAvatarUpload(e) {
        const file = e.target.files[0];

        // 验证文件的媒体类型.
        if (file.type.startsWith('image')) {
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = () => {
                updateUser(draft => {
                    draft.avatar = reader.result; // 获取图片的Base64.
                });
            };
        } else {
            setUploaderModalIsOpen(true);
        }
    }

    /**
     * 处理输入昵称事件函数.
     * @param {React.ChangeEvent<HTMLInputElement>} e 输入框变化事件.
     */
    function handleNameChange(e) {
        updateUser(draft => {
            draft.name = e.target.value;
        });
    }

    return (
        <UserContext.Provider
            value={{
                user,
                uploaderModalIsOpen,
                closeUploaderModal,
                handleAvatarUpload,
                handleNameChange
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node
};
