import PropTypes from 'prop-types';
import React, {useContext} from 'react';

import {UserContext} from '../contexts.js';

import '../styles/message-list.css';

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
            {chatList.map((inputContent, idx) =>
                <li
                    key={idx}
                    className={
                        inputContent.user.name === user.name ?
                            'my-message' : 'other-message'
                    }
                >
                    <div className='content'>
                        {inputContent.user.name}: {inputContent.content}
                    </div>
                </li>
            )}
        </ol>
    );
}

MessageList.propTypes = {
    chatList: PropTypes.arrayOf(PropTypes.object).isRequired,
};
