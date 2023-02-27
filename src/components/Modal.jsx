import { Button, Modal } from 'react-bootstrap';

export default function ComponentName({ show, hide }) {
	return (
		<>
			<Modal show={show} onHide={hide}>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={hide}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
