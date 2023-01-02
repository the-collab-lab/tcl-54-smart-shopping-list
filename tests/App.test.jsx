import { render } from '@testing-library/react';
import { App } from '../src/App';

it('renders without crashing', () => {
	render(<App />);
});
