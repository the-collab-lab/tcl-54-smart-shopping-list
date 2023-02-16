import './ListItem.css';
import { updateItem } from '../api/firebase';
import { useState, useEffect } from 'react';
import { getDaysBetweenDates } from '../utils/dates';

export function ListItem({
	name,
	itemId,
	dateLastPurchased,
	dateNextPurchased,
}) {
	const [check, setCheck] = useState(false);
	//Declare currentDate, colorUrgency, and buyingUrgency
	const currentDate = new Date();
	let colorUrgency;
	let buyingUrgency;

	/**
	 * When List view is opened or refreshed,
	 * this verifies how long since the item was
	 * purchased and checks the box if the item
	 * was purchased fewer than 24 hours ago.
	 */
	useEffect(() => {
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
		const listId = localStorage.getItem('tcl-shopping-list-token');
		setCheck((prevCheck) => {
			updateItem(listId, itemId, !prevCheck);
			return !prevCheck;
		});
	};

	//Function to return the buying urgency tag associated with an item
	const getBuyingUrgency = () => {
		//Returns the difference between the currentDate and dateNextPurchased
		const daysUntilNextPurchase = getDaysBetweenDates(
			currentDate,
			dateNextPurchased.toDate(),
		);

		//Conditional statement to categorize if an item is:
		// - inactive: (60 days have passed since the last purchase)
		// - overdue: currentDate has passed the dateNextPurchased, but not yet inactive
		// - not soon: (30 days or more until the next purchase)
		// - kind of soon: (between 7 & 30 days until the next purchase)
		// - soon: (7 days or fewer until the next purchase)
		if (daysUntilNextPurchase >= 60) {
			buyingUrgency = 'inactive';
			colorUrgency = '#878E88';
		} else if (currentDate > dateNextPurchased.toDate()) {
			buyingUrgency = 'overdue';
			colorUrgency = '#A30000';
		} else if (daysUntilNextPurchase >= 30) {
			buyingUrgency = 'not soon';
			colorUrgency = '#004777';
		} else if (daysUntilNextPurchase > 7 && daysUntilNextPurchase < 30) {
			buyingUrgency = 'kind of soon';
			colorUrgency = '#00AFB5';
		} else {
			buyingUrgency = 'soon';
			colorUrgency = '#FF7700';
		}
	};

	if (name) {
		getBuyingUrgency();
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
					{/* return buying urgency and temporary color identifiers */}
					<span style={{ color: `${colorUrgency}` }}> {buyingUrgency}</span>
				</label>
			</li>
		);
	}
}
