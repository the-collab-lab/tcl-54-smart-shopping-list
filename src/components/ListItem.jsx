import { ReactComponent as TrashIcon } from '../img/icons/trash-icon.svg';
import { updateItem, deleteItem } from '../api/firebase';
import { useState, useEffect } from 'react';
import { getDaysBetweenDates } from '../utils/dates';
import { ListGroup, Form } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';

export function ListItem({ name, itemId, dateLastPurchased, urgency }) {
	const [check, setCheck] = useState(false);
	//Declare currentDate, colorUrgency, and buyingUrgency
	const currentDate = new Date();

	const listId = localStorage.getItem('tcl-shopping-list-token');

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

		getDaysBetweenDates(currentDate, purchasedDate, false) < 1
			? setCheck(true)
			: setCheck(false);
	}, [dateLastPurchased]);

	const handleCheck = async (e) => {
		setCheck((prevCheck) => {
			updateItem(listId, itemId, !prevCheck);
			return !prevCheck;
		});
	};

	// // When remove button is clicked, a confirm window pops up, and when user confirms, deleteItem() is called

	const handleDelete = async () => {
		confirmAlert({
			title: 'Confirm',
			message: `Do you want to remove ${name}?`,
			buttons: [
				{
					label: 'Yes',
					onClick: async () => {
						try {
							await deleteItem(listId, itemId);
							toast.success(`${name} has been removed!`);
						} catch (error) {
							toast.error('An error ocurred while removing your item.');
						}
					},
				},
				{
					label: 'No',
					onClick: () => {},
				},
			],
		});
	};

	/* Checking for the existence of urgency to avoid `undefined` */
	const imgUrgency = urgency ? urgency.imgUrgency : '';

	if (name) {
		return (
			<ListGroup.Item>
				<div className="flex-wrap-item-name">
					<Form>
						<Form.Check
							value={name}
							type="checkbox"
							onChange={handleCheck}
							checked={check}
							disabled={check}
							label={name}
						/>
					</Form>
					<div>
						<TrashIcon
							type="button"
							onClick={handleDelete}
							aria-label="Delete item"
						/>
					</div>
				</div>
				<div className="flex-center-bread-img">{imgUrgency}</div>
			</ListGroup.Item>
		);
	}
}
