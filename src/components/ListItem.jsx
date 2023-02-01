import './ListItem.css';
import { updateItem } from '../api/firebase';
import { useState } from 'react';

export function ListItem({ name, item }) {
	// function using key
	const [check, setCheck] = useState(false);

	const handleCheck = (e) => {
		const listId = localStorage.getItem('tcl-shopping-list-token');
		if (check === false) {
			setCheck(true);
			updateItem(listId, item);
		} else {
			setCheck(false);
		}
	};

	return (
		<li className="ListItem">
			<label>
				<input value={name} type="checkbox" onChange={handleCheck} />
				{name}
			</label>
		</li>
	);
}
