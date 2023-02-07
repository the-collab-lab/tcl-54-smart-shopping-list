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

		const itemData = {
			itemName,
			daysUntilNextPurchase,
		};

		// const shoppingListArr = data.filter((item) => item.name);
		// console.log('shopping list:', shoppingListArr);

		// const updatedComments = commentsCopy.filter((c) => c.commentId !== id);

		const nameMatchesArr = data
			.slice(0, -1)
			.filter((item) => item.name === itemName);
		console.log('name:', nameMatchesArr);

		// console.log('nameMatchesArr.name:', nameMatchesArr[0].name);

		// if (nameMatchesArr[0].name === itemName) {
		// 	console.log('item already exists');
		// 	return;
		// }

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
