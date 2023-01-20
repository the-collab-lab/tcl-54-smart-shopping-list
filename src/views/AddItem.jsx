import { addItem } from '../api/firebase';
import { useState } from 'react';

/**
 * Allows user to add an item to their shopping list,
 * set the next estimated purchase date,
 * and store that to db
 */

export function AddItem({ listId }) {
	// declare itemName, daysUntilNextPurchase, and radioSelect
	// into separate state variables
	const [itemName, setItemName] = useState('');

	const [daysUntilNextPurchase, setDaysUntilNextPurchase] = useState(7);

	const [radioSelect, setRadioSelect] = useState('soon');

	// Store values inside itemData and sent over to database
	// otherwise log an error if request fails
	const onFormSubmit = (event) => {
		event.preventDefault();
		const itemData = {
			itemName,
			daysUntilNextPurchase,
		};
		try {
			addItem(listId, itemData);
			alert(`${itemData.itemName} was added to your list`);
		} catch (error) {
			console.log(error);
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
		setRadioSelect(event.target.value);
	};

	return (
		<form onSubmit={onFormSubmit}>
			<div>
				<label htmlFor="item">Item Name:</label>
			</div>
			<input
				type="text"
				id="item"
				name="item"
				onChange={(event) => setItemName(event.target.value)}
				required={true}
			/>
			<div id="purchase-date-label">How soon will you buy this again?</div>
			<fieldset>
				<div>
					<input
						checked={radioSelect === 'soon'}
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
						checked={radioSelect === 'kind-of-soon'}
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
						checked={radioSelect === 'not-soon'}
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
	);
}
