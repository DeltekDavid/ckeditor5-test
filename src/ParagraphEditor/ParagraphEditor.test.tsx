import { render } from '@testing-library/react';
import React from 'react';
import ParagraphEditor from './ParagraphEditor';

describe('Paragraph Editor', () => {
    it('renders without crashing', () => {
        const component = render(<ParagraphEditor />);
        expect(component).toBeTruthy();
    });

    // TODO proper tests
});