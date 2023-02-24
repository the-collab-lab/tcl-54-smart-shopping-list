import { Container, Nav, Navbar } from 'react-bootstrap';

export function NavbarShoppingList() {
	return (
		<Navbar fluid="md" bg="light" expand="lg">
			<Container>
				<Navbar.Brand href="/">Smart Shopping List</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="/">Home</Nav.Link>
						<Nav.Link href="/list">List</Nav.Link>
						<Nav.Link href="/add-item">Add Item</Nav.Link>
						<Nav.Link
							href="/"
							onClick={() => localStorage.removeItem('tcl-shopping-list-token')}
						>
							Exit List
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
