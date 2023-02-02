import './ListItem.css';
import { updateItem } from '../api/firebase';
import { useState, useEffect } from 'react';

export function ListItem({ name, itemId, dateLastPurchased }) {
	const [check, setCheck] = useState(false);

	useEffect(() => {
		const currentDate = new Date();
		const purchasedDate = dateLastPurchased
			? dateLastPurchased.toDate()
			: dateLastPurchased;
		const timeElapsed = Math.abs(currentDate - purchasedDate);
		const hoursElapsed = timeElapsed / (1000 * 60 * 60);
		hoursElapsed < 24 ? setCheck(true) : setCheck(false);
	}, []);

	const handleCheck = async (e) => {
		const listId = localStorage.getItem('tcl-shopping-list-token');
		if (e.target.checked) {
			setCheck((prevCheck) => {
				updateItem(listId, itemId, !prevCheck);
				return !prevCheck;
			});
		} else {
			setCheck((prevCheck) => {
				updateItem(listId, itemId, !prevCheck);
				return !prevCheck;
			});
		}
	};

	// useEffect(() => {
	// 	const listId = localStorage.getItem('tcl-shopping-list-token');

	// 	if (check) {
	// 		updateItem(listId, itemId, check);
	// 	} else {
	// 		updateItem(listId, itemId, check);
	// 	}
	// }, [check, itemId]);()

	// const toggle = (value) => {
	// 	console.log('value:', value);
	// 	return !value;
	// };

	// const handleCheck = async (e) => {
	// 	const listId = localStorage.getItem('tcl-shopping-list-token');
	// 	const value = toggle(check);
	// 	if (e.target.checked) {
	// 		setCheck(value);
	// 		console.log('check:', check);
	// 	} else {
	// 		setCheck(value);
	// 		console.log('check:', check);
	// 	}
	// 	await updateItem(listId, itemId, check);
	// };

	// const handleCheck = async (e) => {
	// 	const listId = localStorage.getItem('tcl-shopping-list-token');
	// 	setCheck(!check)
	// 		.then(() => {
	// 			updateItem(listId, itemId, check);
	// 		})
	// 		.catch((error) => {
	// 			console.log(error);
	// 		});
	// };

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
				<input
					value={name}
					type="checkbox"
					onChange={handleCheck}
					checked={check}
				/>
				{name}
			</label>
		</li>
	);
}
