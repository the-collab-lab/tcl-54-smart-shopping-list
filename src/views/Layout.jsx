import { Outlet, NavLink } from 'react-router-dom';

import './Layout.css';

export function Layout() {
	return (
		<>
			<div className="Layout">
				<header className="Layout-header">
					<h1>Smart shopping list</h1>
				</header>
				<main className="Layout-main">
					<Outlet />
				</main>
			</div>
		</>
	);
}
