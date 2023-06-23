import PropTypes from 'prop-types';
import React, {useContext} from 'react';

import {UserContext} from '../contexts.js';

import '../styles/message-list.css';

/**
 * MyMessage组件, 用于展示当前用户发送的消息.
 * @param {Object} messageObject - 消息对象.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <MyMessage messageObject={messageObject}/>
 */
function MyMessage({messageObject}) {
    const name = messageObject.user.name;
    const content = messageObject.content;

    return (
        <li className='my-message'>
            <div className='content'>
                {name}: {content}
            </div>
        </li>
    );
}

/**
 * OtherMessage组件, 用于展示其他用户发送的消息.
 * @param {Object} messageObject - 消息对象.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <OtherMessage messageObject={messageObject}/>
 */
function OtherMessage({messageObject}) {
    const name = messageObject.user.name;
    const content = messageObject.content;

    return (
        <li className='other-message'>
            <div className='content'>
                {name}: {content}
            </div>
        </li>
    );
}

/**
 * MessageList组件, 显示用户聊天内容.
 * @param {Object[]} chatList - 聊天内容列表.
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <MessageList chatList={chatList}/>
 */
export default function MessageList({chatList}) {
    // 用户信息.
    const user = useContext(UserContext);

    return (
        <ol className='message-list'>
            {chatList.map((messageObject, idx) =>
                messageObject.user.name === user.name ? (
                    <MyMessage key={idx} messageObject={messageObject}/>
                ): (
                    <OtherMessage key={idx} messageObject={messageObject}/>
                )
            )}
        </ol>
    );
}

MyMessage.propTypes = {
    messageObject: PropTypes.object.isRequired
};
OtherMessage.propTypes = {
    messageObject: PropTypes.object.isRequired
};
MessageList.propTypes = {
    chatList: PropTypes.arrayOf(PropTypes.object).isRequired
};
