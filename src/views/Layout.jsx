import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import React, { useState } from 'react';
import { Image } from 'react-bootstrap';

import './Layout.css';

export function Layout({ listToken }) {
	// useLocation hook will be used to check current route
	const location = useLocation();
	const [copied, setCopied] = useState(false);

	if (location.pathname === '/list') {
		return (
			<React.Fragment>
				<div className="Layout">
					<header className="Layout-header">
						<h4>Current List:</h4>
						<h1>
							{listToken}
							<span>
								<CopyToClipboard text="Hello!">
									<Image type="button" src="../img/icons/copy-icon.svg" />
								</CopyToClipboard>
							</span>
						</h1>
					</header>
					<main className="Layout-main">
						<Outlet />
					</main>
				</div>
			</React.Fragment>
		);
	}

	return (
		<div className="Layout">
			<header className="Layout-header">
				<h1>Smart shopping list</h1>
			</header>
			<main className="Layout-main">
				<Outlet />
			</main>
		</div>
	);
}
