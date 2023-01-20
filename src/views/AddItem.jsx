import { addItem } from '../api/firebase';
import { useState } from 'react';

export function AddItem({ listId }) {
	// declare itemName and daysUntilNextPurchase into separate state variables
	const [itemName, setItemName] = useState('');

	const [daysUntilNextPurchase, setDaysUntilNextPurchase] = useState(null);

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

	// Get user input and set itemName
	const handleItemName = (event) => {
		setItemName(event.target.value);
	};

	// Get radio selection and set daysUntilNextPurchase
	const handlePurchaseDate = (event) => {
		let date = null;
		if (event.target.value === 'soon') {
			date = 7;
		} else if (event.target.value === 'kind-of-soon') {
			date = 14;
		} else if (event.target.value === 'not-soon') {
			date = 30;
		}
		setDaysUntilNextPurchase(date);
	};

	return (
		<form onSubmit={onFormSubmit}>
			<div>
				<label htmlFor="item">Item Name:</label>
			</div>
			<input type="text" id="item" name="item" onChange={handleItemName} />
			<div>How soon will you buy this again?</div>
			<fieldset>
				<div>
					<input
						checked
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
	);
}
