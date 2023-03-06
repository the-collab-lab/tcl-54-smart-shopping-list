/** This modified code block waits for the DOM to fully load
 * before mounting the React app to the `root` element.
 * Seems to solve the prior error we were having that prevented
 * the app to load properyly on refreshes.
 */

import { createRoot } from 'react-dom/client';
import { App } from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const mountApp = () => {
	const root = document.getElementById('root');
	if (root) {
		createRoot(root).render(<App />);
	} else {
		console.error('Could not find root element');
	}
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', mountApp);
} else {
	mountApp();
}
