import './ListItem.css';
import { updateItem, deleteItem } from '../api/firebase';
import { useState, useEffect } from 'react';
import { getDaysBetweenDates } from '../utils/dates';

export function ListItem({ name, itemId, dateLastPurchased }) {
	const [check, setCheck] = useState(false);

	const listId = localStorage.getItem('tcl-shopping-list-token');

	/**
	 * When List view is opened or refreshed,
	 * this verifies how long since the item was
	 * purchased and checks the box if the item
	 * was purchased fewer than 24 hours ago.
	 */
	useEffect(() => {
		const currentDate = new Date();
		/*  purchaseDate is filtering for dates that exists in the Firestore shopping list collection
		 And if date exists, it's converting it to a JavaScript timestamp */
		let purchasedDate = dateLastPurchased
			? dateLastPurchased.toDate()
			: dateLastPurchased;

		/* Imports this function from `dates.js` in utils folder and returns
		the days of elapsedtime between two dates
		Then, the checked value here is passed as a property to `firebase.js` relaying if
		the number of hours between the purchase date and the current time is less than 1 day
		*/
		getDaysBetweenDates(currentDate, purchasedDate) < 1
			? setCheck(true)
			: setCheck(false);
	}, [dateLastPurchased]);

	const handleCheck = async (e) => {
		setCheck((prevCheck) => {
			updateItem(listId, itemId, !prevCheck);
			return !prevCheck;
		});
	};

	// When remove button is clicked, a confirm window pops up, and when user confirms, deleteItem() is called
	const handleDelete = async () => {
		// eslint-disable-next-line no-restricted-globals
		if (confirm(`Do you want to remove ${name}?`)) {
			await deleteItem(listId, itemId);
		}
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
				<button type="button" onClick={handleDelete}>
					Remove
				</button>
			</li>
		);
	}
}
