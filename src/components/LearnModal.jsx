import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { instructions } from '../data/modal-instructions';

export default function LearnModal({ show, hide }) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handlePrev = () => {
		setCurrentIndex(
			(currentIndex + instructions.length - 1) % instructions.length,
		);
	};

	const handleNext = () => {
		setCurrentIndex(
			(currentIndex + instructions.length + 1) % instructions.length,
		);
	};

	return (
		<Modal show={show} onHide={hide}>
			<Modal.Header closeButton>
				<Modal.Title>Modal heading</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>{instructions[currentIndex].text}</p>
				<div className="controls">
					<button type="button" onClick={handlePrev} className="button">
						<i className="fa-solid fa-arrow-left" />
					</button>
					<button type="button" onClick={handleNext} className="button">
						<i className="fa-solid fa-arrow-right" />
					</button>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={hide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
