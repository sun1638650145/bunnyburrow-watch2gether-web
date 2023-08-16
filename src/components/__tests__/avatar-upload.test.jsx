import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';

import AvatarUpload from '../avatar-upload.jsx';

describe('AvatarUpload', () => {
    test('未上传用户头像', () => {
        render(<AvatarUpload avatar='' onAvatarChange={() => {}}/>);

        // 上传用户头像元素.
        const avatarInput = screen.getByLabelText('+');

        expect(avatarInput).toBeTruthy();
    });

    test('上传用户头像时', () => {
        const mockOnAvatarChange = jest.fn();
        render(<AvatarUpload avatar='' onAvatarChange={mockOnAvatarChange}/>);

        // 触发上传用户头像事件.
        const avatarInput = screen.getByLabelText('+');
        fireEvent.change(avatarInput, {
            target: {
                files: [new File([''], 'example.png', {type: 'image/png'})]
            }
        });

        expect(mockOnAvatarChange).toBeCalledTimes(1);
    });

    test('显示用户头像', () => {
        render(
            <AvatarUpload
                avatar='https://example.com/example.png'
                onAvatarChange={() => {}}
            />
        );

        // 用户头像元素.
        const avatarImage = screen.getByRole('img');

        expect(avatarImage).toBeTruthy();
    });
});
