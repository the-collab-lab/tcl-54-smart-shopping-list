import { Outlet, useLocation } from 'react-router-dom';

// import './Layout.css';
import { NavbarShoppingList } from '../components';

export function Layout() {
	const location = useLocation();
	return (
		<>
			{location.pathname !== '/' && <NavbarShoppingList />}
			<div className="Layout">
				{/* <header className="Layout-header">
					<h1>Smart shopping list</h1>
				</header> */}
				<main className="Layout-main">
					<Outlet />
				</main>
			</div>
		</>
	);
}
