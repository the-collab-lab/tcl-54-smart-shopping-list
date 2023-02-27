import { Button, Modal, Carousel } from 'react-bootstrap';

export default function ComponentName({ show, hide }) {
	return (
		<Modal show={show} onHide={hide}>
			<Modal.Header closeButton>
				<Modal.Title>Modal heading</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Carousel variant="dark">
					<Carousel.Item>
						Woohoo, you're reading this text in a modal!
					</Carousel.Item>
					<Carousel.Item>Two</Carousel.Item>
					<Carousel.Item>Three</Carousel.Item>
				</Carousel>
				{/* Text here */}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={hide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
