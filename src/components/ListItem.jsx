import './ListItem.css';
import { updateItem } from '../api/firebase';
import { useState, useEffect } from 'react';

export function ListItem({ name, itemId }) {
	const [check, setCheck] = useState(false);

	useEffect(() => {
		const listId = localStorage.getItem('tcl-shopping-list-token');

		if (check) {
			updateItem(listId, itemId, check);
		} else {
			updateItem(listId, itemId, check);
		}
	}, [check, itemId]);

	const handleCheck = (e) => {
		if (e.target.checked) {
			setCheck(true);
		} else {
			setCheck(false);
		}
	};

	// const handleCheck = (e) => {
	// 	const listId = localStorage.getItem('tcl-shopping-list-token');
	// 	if (e.target.checked) {
	// 		setCheck(true);
	// 		updateItem(listId, itemId, check);
	// 	} else {
	// 		setCheck(false);
	// 	}
	// };

	// const handleCheck = (e) => {
	// 	const listId = localStorage.getItem('tcl-shopping-list-token');
	// 	if (check === false) {
	// 		setCheck(true);
	// 		updateItem(listId, item);
	// 	} else {
	// 		setCheck(false);
	// 	}
	// };

	return (
		<li className="ListItem">
			<label>
				<input value={name} type="checkbox" onChange={handleCheck} />
				{name}
			</label>
		</li>
	);
}
