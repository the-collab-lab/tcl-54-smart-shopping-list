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
		const listId = localStorage.getItem('tcl-shopping-list-token');
		setCheck((prevCheck) => {
			updateItem(listId, itemId, !prevCheck);
			return !prevCheck;
		});
	};

	//Function to return the buying urgency tag associated with an item
	const getBuyingUrgency = () => {
		//declare value for buying urgency string to be returned
		let buyingUrgency;

		//Use getDaysBetweenDates to find the difference between the current date and dateNextPurchased
		//Note - this doesn't specify yet whether a dateNextPurchase date has passed
		const daysUntilNextPurchase = getDaysBetweenDates(
			new Date(),
			dateNextPurchased.toDate(),
		);

		/**
		 * TODO: STRETCH GOAL: (overdue)
		 * 	- Extend the functionality of comparePurchaseUrgency to sort “overdue” items to the top of the list
		 *	- Indicate in your UI when an item is overdue
		 * QUESTION:
		 * 	What shows date next purchase has passed? To be placed in conditional below
		 */
		let daysSinceLastPurchase = dateLastPurchased
			? getDaysBetweenDates(
					dateNextPurchased.toDate(),
					dateLastPurchased.toDate(),
			  )
			: dateLastPurchased;

		//if else statement to declare which of the 4 possible groups of urgency it belongs to
		if (daysUntilNextPurchase >= 60) {
			buyingUrgency = 'inactive (has not been purchased recently)';
		} else if (daysUntilNextPurchase >= 30) {
			buyingUrgency = 'not soon (more than 30 days)';
		} else if (daysUntilNextPurchase > 7 && daysUntilNextPurchase < 30) {
			buyingUrgency = 'kind of soon (30 days or less)';
		} else {
			buyingUrgency = 'soon (7 days or less)';
		}
		return buyingUrgency;
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
					&nbsp;
					{/* return buying urgency string */}
					{getBuyingUrgency()}
				</label>
			</li>
		);
	}
}
