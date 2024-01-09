import { LabelTypes } from '../components/LabelTypes';

    // only syntaxis check
    test('communities page test', () => {
        const container = LabelTypes({id:0});
        expect(container.props.className).toBe('page');
    });

