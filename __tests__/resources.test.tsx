import { Resources } from '../components/Resources';

    // only syntaxis check
    test('resources page test', () => {
        const container = Resources({id:0});
        expect(container.props.className).toBe('page');
    });

