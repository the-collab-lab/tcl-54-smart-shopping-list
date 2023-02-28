import { Button, Modal } from 'react-bootstrap';
import { useState } from 'React';

const instructions = [
	{
		text: '1. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque explicabo excepturi minima fuga exercitationem perferendis. Vero aliquid iure dignissimos incidunt.',
	},
	{
		text: '2. Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
	},
	{
		text: '3. Atque explicabo excepturi minima fuga exercitationem perferendis. Vero aliquid iure dignissimos incidunt.',
	},
];

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
