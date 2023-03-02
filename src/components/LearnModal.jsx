import { Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { instructions } from '../data/modal-instructions';

/** This modal will provide more detail on how to use the app
 * if the user wants to know more
 */

export default function LearnModal({ show, hide }) {
	/** index in useState will be used for the carousel function of the modal */
	const [currentIndex, setCurrentIndex] = useState(0);

	/** the useEffect keeps track of the state of `show`.
	 * If `show` is false, it will reset the carousel's index to 0.
	 * This is so that when a user clicks off the modal and clicks to view it again,
	 * they are brought back to the first slide of the carousel
	 */
	useEffect(() => {
		if (!show) {
			setCurrentIndex(0);
		}
	}, [show]);

	/** handler functions for the arrow buttons in modal,
	 * which lets user navigate through the carousel slides
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
				<Modal.Title>Get Started</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{/** The imported text from `modal-instructions.js` file are conditionally rendered
				 * based on the slide of the carousel
				 */}
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
					<button
						type="button"
						onClick={handlePrev}
						className={`btn-custom btn-arrow ${
							currentIndex === 0 && 'disabled'
						}`}
						disabled={currentIndex === 0}
					>
						<i className="fa-solid fa-arrow-left" />
					</button>
					<button
						type="button"
						onClick={handleNext}
						className={`btn-custom btn-arrow ${
							currentIndex === 3 && 'disabled'
						}`}
						disabled={currentIndex === 3}
					>
						<i className="fa-solid fa-arrow-right" />
					</button>
				</div>
				<button type="button" className="btn-custom p-2" onClick={hide}>
					Close
				</button>
			</Modal.Footer>
		</Modal>
	);
}
