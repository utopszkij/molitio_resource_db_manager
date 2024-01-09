import { Communities } from '../components/Communities';

    // only syntaxis check
    test('communities page test', () => {
        const container = Communities({id:0});
        expect(container.props.className).toBe('page');
    });

