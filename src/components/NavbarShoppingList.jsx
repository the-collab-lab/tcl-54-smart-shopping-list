import { Container, Nav, Navbar, Image } from 'react-bootstrap';
import { useLocation } from 'react-router';
import appLogo from '../img/bread-styling/burger-boy1.png';

export function NavbarShoppingList() {
	// useLocation hook is used to access the current route
	const location = useLocation();

	return (
		<Navbar fluid="md" expand="lg" className="navbar-custom">
			<Container fluid className="m-0">
				<Navbar.Brand href="/" className="d-flex align-items-center">
					<div className="logo-text-container d-flex align-items-center">
						<Image src={appLogo} className="app-logo-navbar" />
						<span className="app-name">Smart Shopping List</span>
					</div>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto text-center">
						<Nav.Link href="/">Home</Nav.Link>
						<Nav.Link href="/list">List</Nav.Link>
						<Nav.Link href="/add-item">Add Item</Nav.Link>

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
