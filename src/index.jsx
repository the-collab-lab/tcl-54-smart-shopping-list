import { createRoot } from 'react-dom/client';
import { App } from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
// TODO: When pushing branch to main, address merge conflict issues with kept index.css
// import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
