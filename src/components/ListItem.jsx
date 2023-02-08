import './ListItem.css';
import { updateItem } from '../api/firebase';
import { useState, useEffect } from 'react';
import { getDaysBetweenDates } from '../utils/dates';

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
		/*  purchaseDate is filtering for dates that exists in the Firestore shopping list collection
		 And if date exists, it's converting it to a JavaScript timestamp */
		let purchasedDate = dateLastPurchased
			? dateLastPurchased.toDate()
			: dateLastPurchased;

		/* Finding elapsed time by finding the absolute value of currentDate substracted from purchaseDate
		 The result of timeElapsed will is in miliseconds */
		const timeElapsed = Math.abs(currentDate - purchasedDate);

		/* hoursElapsed converts the miliseconds of timeElapsed into hours */
		const hoursElapsed = timeElapsed / (1000 * 60 * 60);

		/* The checked value here is passed as a property to `firebase.js` relaying if
			the number of hours between the purchase date and the current time is less
			than 24 hours */
		hoursElapsed < 24 ? setCheck(true) : setCheck(false);

		if (dateLastPurchased) {
			console.log('item name: ', name);
			console.log('Firestore format: ', dateLastPurchased);
			console.log('using .toDate(): ', dateLastPurchased.toDate());
			// console.log("using .getTime(): ", dateLastPurchased.getTime())
			console.log(
				'using .toDate() and .getTime(): ',
				dateLastPurchased.toDate().getTime(),
			);
			console.log('timeElapsed: ', timeElapsed);
			// console.log("time elapsed using .getTime: ", currentDate = dateLastPurchased.getTime())
			console.log('currentDate: ', currentDate);
			console.log('currentDate with .getTime(): ', currentDate.getTime());
			console.log(
				'time elapsed with .getTime: ',
				currentDate.getTime() - dateLastPurchased.toDate().getTime(),
			);
		}

		// test ad
		// console.log(getDaysBetweenDates(purchasedDate, currentDate));
	}, [dateLastPurchased]);

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
