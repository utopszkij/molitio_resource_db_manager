import { Collections } from '../components/Collections';

    // only syntaxis check
    test('communities page test', () => {
        const container = Collections({id:0});
        expect(container.props.className).toBe('page');
    });

