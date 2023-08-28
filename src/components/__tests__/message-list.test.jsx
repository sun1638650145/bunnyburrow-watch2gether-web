import React from 'react';
import {describe, expect, test} from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import {render, screen} from '@testing-library/react';

import MessageList from '../../message-list.jsx';

describe('MessageList', () => {
    test('正确渲染聊天内容', () => {
        const chatList = [{
            user: {
                avatar: 'https://example.com/example.png',
                name: 'Steve'
            },
            content: 'Hello!'
        }];
        render(<MessageList chatList={chatList}/>);

        const otherMessage = screen.getByText('Hello!');

        expect(otherMessage).toBeInTheDocument();
    });
});
