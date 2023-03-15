import { Container, Nav, Navbar, Image } from 'react-bootstrap';
import { useLocation } from 'react-router';
import appLogo from '../img/bread-styling/burger-boy1.png';

export function NavbarShoppingList() {
	// useLocation hook is used to access the current route
	const location = useLocation();

	return (
		<Navbar expand="lg" className="navbar-custom">
			<Container className="justify-content-center">
				<Navbar.Brand href="/list">
					<Image src={appLogo} className="app-logo-navbar" />
					Knead to Buy
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto text-center">
						<Nav.Link href="/list">List</Nav.Link>
						<Nav.Link href="/add-item">Add Items</Nav.Link>

						{/* This will make 'Exit List' visible ONLY when route is on /list */}
						{location.pathname !== '/' && (
							<Nav.Link
								href="/"
								onClick={() =>
									localStorage.removeItem('tcl-shopping-list-token')
								}
							>
								Exit List
							</Nav.Link>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
