import '../styles/Layout.css';
import { ReactComponent as CopyIcon } from '../img/icons/copy-icon.svg';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast, { Toaster } from 'react-hot-toast';
import { NavbarShoppingList } from '../components';

export function Layout({ listToken }) {
	// useLocation hook will be used to check current route
	const location = useLocation();

	// Notify when copying item is successful
	const notifyCopied = () => toast('Copied!');

	// List view header will display if on list pathname
	// to show the current list token of the use with copy functionality
	if (location.pathname === '/list') {
		return (
			<>
				<NavbarShoppingList />
				<div className="List">
					<Toaster />
					<header className="List-header">
						<h4>Current List:</h4>
						<h1>
							{listToken}
							<span>
								<CopyToClipboard text={listToken}>
									<CopyIcon
										type="button"
										onClick={notifyCopied}
										aria-label="Copy list token to clipboard"
									/>
								</CopyToClipboard>
							</span>
						</h1>
					</header>
					<main className="Layout-main">
						<Outlet />
					</main>
				</div>
			</>
		);
	}

	return (
		<>
			{location.pathname !== '/' && <NavbarShoppingList />}
			<div className="Layout">
				<main className="Layout-main">
					<Outlet />
				</main>
			</div>
		</>
	);
}
