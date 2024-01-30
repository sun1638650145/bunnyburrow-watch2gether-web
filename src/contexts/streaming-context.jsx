import PropTypes from 'prop-types';
import React, {createContext} from 'react';
import {useImmer} from 'use-immer';

/**
 * 流媒体视频源Context值.
 * @typedef {Object} StreamingContextValue
 * @property {Object} streaming 流媒体视频源.
 * @property {string} streaming.type 视频源媒体类型.
 * @property {string} streaming.url 视频源url.
 * @property {function} handleStreamingChange 处理输入流媒体视频源函数.
 */

/**
 * 流媒体视频源Context.
 * @type {React.Context<StreamingContextValue>}
 */
export const StreamingContext = createContext({});

/**
 * 流媒体视频源Context的Provider.
 * @param {React.ReactNode} children
 * @returns {React.ReactNode}
 * @constructor
 */
export function StreamingProvider({children}) {
    // 流媒体视频源.
    const [streaming, updateStreaming] = useImmer({
        type: 'application/x-mpegURL', // TODO(Steve): 暂不可自定义媒体类型.
        url: '' // 视频源url.
    });

    /**
     * 处理输入流媒体视频源函数.
     * @param {React.ChangeEvent<HTMLInputElement>} e 输入框变化事件.
     */
    function handleStreamingChange(e) {
        updateStreaming(draft => {
            draft.url = e.target.value;
        });
    }

    return (
        <StreamingContext.Provider value={{streaming, handleStreamingChange}}>
            {children}
        </StreamingContext.Provider>
    );
}

StreamingProvider.propTypes = {
    children: PropTypes.node
};
