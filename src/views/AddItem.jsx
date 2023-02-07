import { addItem } from '../api/firebase';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

/**
 * Allows user to add an item to their shopping list,
 * set the next estimated purchase date,
 * and store that to db
 */

export function AddItem({ listToken, data }) {
	// declare itemName, daysUntilNextPurchase, and radioSelect
	// into separate state variables
	const [itemName, setItemName] = useState('');
	const [daysUntilNextPurchase, setDaysUntilNextPurchase] = useState(7);

	// react-hot-toast notifications:

	// Notify when adding item is unsuccessful
	const notifyFailedRequest = () => toast.error('Failed to add item');

	// Notify if the item already exists in db
	const notifyInList = () => toast.error('Already in your list');

	// Notify when adding item but there's no list token
	const notifyNoToken = () => toast.error('Please add a list token first');

	// Notify when adding item is successful
	const notifyItemAdded = (itemName) => {
		toast.success(`${itemName} was added to your list`);
	};

	// Store values inside itemData and sent over to database
	// otherwise log an error if request fails
	const onFormSubmit = (e) => {
		e.preventDefault();

		// if list token is not provided, notify user and exit function
		if (!listToken) {
			notifyNoToken();
			return;
		}

		// Updates the relevant data in db
		const itemData = {
			itemName,
			daysUntilNextPurchase,
		};

		// We are looking for an array of items that matches the user input
		// We use `toLowerCase` and `replaceAll` to account for edge cases,
		// such as casing and extra spaces
		const nameMatchesArr = data.some((item) => {
			return (
				item.name &&
				item.name.replaceAll(' ', '') ===
					itemName.toLowerCase().replaceAll(' ', '')
			);
		});

		// The user is notified if the input matches an item in db
		// Item does not get added; exits the function
		if (nameMatchesArr) {
			notifyInList();
			return;
		}

		// If the input has no match in db, the item is added, notifies the user,
		// and sets input back to empty string.
		// Errors are handled otherwise.
		try {
			addItem(listToken, itemData);
			setItemName('');
			notifyItemAdded(itemData.itemName);
		} catch (error) {
			notifyFailedRequest();
		}
	};

	// Get radio selection and set daysUntilNextPurchase
	const handlePurchaseDate = (event) => {
		const whenToPurchase = {
			soon: 7,
			'kind-of-soon': 14,
			'not-soon': 30,
		};
		const date = whenToPurchase[event.target.value];
		setDaysUntilNextPurchase(date);
	};

	return (
		<>
			<form onSubmit={onFormSubmit}>
				<div>
					<label htmlFor="item">Item Name:</label>
				</div>
				<input
					type="text"
					id="item"
					name="item"
					value={itemName}
					onChange={(e) => setItemName(e.target.value)}
					required={true}
				/>
				<div id="purchase-date-label">How soon will you buy this again?</div>
				<fieldset>
					<div>
						<input
							defaultChecked
							aria-labelledby="purchase-date-label"
							type="radio"
							value="soon"
							id="soon"
							name="radio-btn"
							onChange={handlePurchaseDate}
						/>
						<label htmlFor="soon">Soon</label>
					</div>
					<div>
						<input
							type="radio"
							value="kind-of-soon"
							id="kind-of-soon"
							name="radio-btn"
							onChange={handlePurchaseDate}
						/>
						<label htmlFor="kind-of-soon">Kind Of Soon</label>
					</div>
					<div>
						<input
							type="radio"
							id="not-soon"
							value="not-soon"
							name="radio-btn"
							onChange={handlePurchaseDate}
						/>
						<label htmlFor="not-soon">Not Soon</label>
					</div>
				</fieldset>
				<button type="submit">Add Item</button>
			</form>
			<Toaster />
		</>
	);
}
