import React from 'react';
import {describe, expect, test} from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import {render, screen} from '@testing-library/react';

import VideoPlayerModal from '../../video-player-modal.jsx';

describe('VideoPlayerModal', () => {
    test('显示模态框', () => {
        render(<VideoPlayerModal isOpen={true} message='Hello, World!'/>);

        const videoPlayerModal = screen.getByText('Hello, World!');

        expect(videoPlayerModal).toBeInTheDocument();
    });
});
