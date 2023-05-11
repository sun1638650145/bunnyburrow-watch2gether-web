import {createContext} from 'react';

// 传递播放器事件回调函数.
export const ReadyContext = createContext(() => {});
// 传递流媒体视频源.
export const SourcesContext = createContext({
    src: '',
    type: ''
});
