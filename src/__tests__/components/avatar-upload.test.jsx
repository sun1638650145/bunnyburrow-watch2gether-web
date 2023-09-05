import React from 'react';
import {describe, expect, jest, test} from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import {fireEvent, render} from '@testing-library/react';

import AvatarUpload from '../../components/avatar-upload.jsx';

describe('AvatarUpload', () => {
    test('未上传用户头像', () => {
        const {container} = render(
            <AvatarUpload avatar='' onAvatarChange={() => {}}/>
        );

        const avatarImage = container.querySelector('.avatar');
        const fileInput = container.querySelector('#file-input');

        expect(avatarImage).toBe(null); // 不存在用户头像元素.
        expect(fileInput).toBeInTheDocument(); // 上传用户头像元素.
    });

    test('上传用户头像时', () => {
        const mockOnAvatarChange = jest.fn();
        const {container} = render(
            <AvatarUpload avatar='' onAvatarChange={mockOnAvatarChange}/>
        );

        const fileInput = container.querySelector('#file-input');
        fireEvent.change(fileInput, {
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
        const fileInput = container.querySelector('#file-input');

        expect(avatarImage).toBeInTheDocument(); // 渲染用户头像元素.
        expect(fileInput).toBe(null); // 不存在上传用户头像元素.
    });
});
