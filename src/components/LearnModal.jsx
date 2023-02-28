import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { instructions } from '../data/modal-instructions';

/** This modal will provide more detail on how to use the app
 * if the user wants to know more
 */

export default function LearnModal({ show, hide }) {
	/** index in useState will be used for the carousel function of the modal */
	const [currentIndex, setCurrentIndex] = useState(0);

	/** handler functions for the arrow buttons in modal,
	 * which lets user navigate through the instructions like a carousel
	 */
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
				<Modal.Title>Welcome to App Title!</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{/** The imported text from `modal-instructions.js` file are conditionally rendered
				 * based on the page of the carousel
				 */}
				{currentIndex === 0 && <p>Get Started</p>}
				{currentIndex !== 3 && <p>{instructions[currentIndex].text}</p>}
				{currentIndex === 2 && (
					<>
						<p className="mb-2">• {instructions[2].stepOne}</p>
						<p className="mb-2">• {instructions[2].stepTwo}</p>
						<p className="mb-2">• {instructions[2].stepThree}</p>
					</>
				)}
				{currentIndex === 3 && (
					<>
						<p>Notes:</p>
						<p>{instructions[3].noteOne}</p>
						<p>{instructions[3].noteTwo}</p>
					</>
				)}
			</Modal.Body>
			<Modal.Footer className="justify-content-between">
				{/* Next and Previous buttons in modal */}
				<div className="controls">
					<button type="button" onClick={handlePrev} className="button">
						<i className="fa-solid fa-arrow-left" />
					</button>
					<button type="button" onClick={handleNext} className="button">
						<i className="fa-solid fa-arrow-right" />
					</button>
				</div>
				<Button variant="secondary" onClick={hide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
