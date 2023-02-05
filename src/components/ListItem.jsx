import './ListItem.css';
import { updateItem } from '../api/firebase';
import { useState, useEffect } from 'react';

export function ListItem({ name, itemId, dateLastPurchased }) {
	const [check, setCheck] = useState(false);

	/**
	 * When List view is opened or refreshed,
	 * this verifies how long since the item was
	 * purchased and checks the box if the item
	 * was purchased fewer than 24 hours ago.
	 */
	useEffect(() => {
		const currentDate = new Date();
		let purchasedDate = dateLastPurchased
			? dateLastPurchased.toDate()
			: dateLastPurchased;
		const timeElapsed = Math.abs(currentDate - purchasedDate);
		const hoursElapsed = timeElapsed / (1000 * 60 * 60);
		hoursElapsed < 24 ? setCheck(true) : setCheck(false);
	}, []);

	const handleCheck = async (e) => {
		const listId = localStorage.getItem('tcl-shopping-list-token');
		setCheck((prevCheck) => {
			updateItem(listId, itemId, !prevCheck);
			return !prevCheck;
		});
	};

	if (name) {
		return (
			<li className="ListItem">
				<label>
					<input
						value={name}
						type="checkbox"
						onChange={handleCheck}
						checked={check}
						disabled={check}
					/>
					{name}
				</label>
			</li>
		);
	}
}
