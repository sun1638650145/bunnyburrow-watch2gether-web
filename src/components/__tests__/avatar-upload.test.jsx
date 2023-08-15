import React from 'react';
import {screen, render} from '@testing-library/react';

import AvatarUpload from '../avatar-upload.jsx';

describe('用户头像组件', () => {
    test('初始化组件.', () => {
        render(<AvatarUpload avatar='' onAvatarChange={() => {}}/>);

        const avatarInput = screen.getByText('+');
        expect(avatarInput).toBeTruthy();
    });
});
