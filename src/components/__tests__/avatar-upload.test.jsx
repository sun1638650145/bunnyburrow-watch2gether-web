import React from 'react';
import {describe, expect, test} from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import {fireEvent, render, screen} from '@testing-library/react';

import AvatarUpload from '../avatar-upload.jsx';

describe('AvatarUpload', () => {
    test('未上传用户头像', () => {
        const {container} = render(
            <AvatarUpload avatar='' onAvatarChange={() => {}}/>
        );

        const avatarImage = container.querySelector('.avatar');
        const avatarInput = screen.getByLabelText('+');

        expect(avatarImage).toBe(null); // 不存在用户头像元素.
        expect(avatarInput).toBeInTheDocument(); // 上传用户头像元素.
    });

    test('上传用户头像时', () => {
        const mockOnAvatarChange = jest.fn();
        render(<AvatarUpload avatar='' onAvatarChange={mockOnAvatarChange}/>);

        const avatarInput = screen.getByLabelText('+');
        fireEvent.change(avatarInput, {
            target: {
                files: [new File([''], 'example.png', {type: 'image/png'})]
            }
        });

        expect(mockOnAvatarChange).toBeCalledTimes(1); // 触发上传用户头像事件.
    });

    test('显示用户头像', () => {
        const {container} = render(
            <AvatarUpload
                avatar='https://example.com/example.png'
                onAvatarChange={() => {}}
            />
        );

        const avatarImage = container.querySelector('.avatar');
        const avatarInput = screen.queryByLabelText('+');

        expect(avatarImage).toBeInTheDocument(); // 渲染用户头像元素.
        expect(avatarInput).toBe(null); // 不存在上传用户头像元素.
    });
});
