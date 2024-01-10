import { Labels } from '../components/Labels';

    // only syntaxis check
    test('communities page test', () => {
        const container = Labels({id:0});
        expect(container.props.className).toBe('page');
    });

