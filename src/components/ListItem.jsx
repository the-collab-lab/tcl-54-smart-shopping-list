import './ListItem.css';
import { updateItem } from '../api/firebase';
import { useState, useEffect } from 'react';
import { getDaysBetweenDates } from '../utils/dates';
import { comparePurchaseUrgency } from '../api/firebase';

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

	const getBuyingUrgency = () => {
		//Use getDaysBetweenDates to find the difference between dateLastPurchased and dateNextPurchased
		const daysUntilNextPurchase = getDaysBetweenDates(
			new Date(),
			dateNextPurchased.toDate(),
		);

		let daysSinceLastPurchase = dateLastPurchased
			? getDaysBetweenDates(new Date(), dateLastPurchased.toDate())
			: dateLastPurchased;

		let buyingUrgency;

		//if else statement to declare which of the 4 possible groups of urgency it belongs to
		if (daysUntilNextPurchase >= 60) {
			buyingUrgency = 'inactive (has not been purchased recently)';
		} else if (daysUntilNextPurchase > 30 && daysSinceLastPurchase > 0) {
			buyingUrgency = 'overdue for purchase';
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
		/**TEST AD
		 *
		 */
		// let buyingUrgency = comparePurchaseUrgency(dateNextPurchased);
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
					&nbsp; frequency: {getBuyingUrgency()}
				</label>
			</li>
		);
	}
}
