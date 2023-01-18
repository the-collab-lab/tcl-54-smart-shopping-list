import { addItem } from '../api/firebase';
import { useState } from 'react';

export function AddItem({ listId }) {
	//Separated itemName and daysUntilNextPurchase inside of state
	const [itemName, setItemName] = useState('');

	const [daysUntilNextPurchase, setDaysUntilNextPurchase] = useState(null);

	// stored values inside itemData and sent over to database
	const onFormSubmit = (event) => {
		event.preventDefault();
		const itemData = {
			itemName,
			daysUntilNextPurchase,
		};
		addItem(listId, itemData);
	};

	//Get user input and set itemName
	const handleItemName = (event) => {
		setItemName(event.target.value);
	};

	// get radio selection and set daysUntilNextPurchase
	const handlePurchaseDate = (event) => {
		let date = null;
		if (event.target.name === 'soon') {
			date = 7;
		} else if (event.target.name === 'kind-of-soon') {
			date = 14;
		} else if (event.target.name === 'not-soon') {
			date = 30;
		}
		setDaysUntilNextPurchase(date);
	};

	return (
		<form onSubmit={onFormSubmit}>
			<div>Item name:</div>
			<input type="text" name="item" onChange={handleItemName} />
			<div>How soon will you buy this again?</div>
			<div>
				<input
					type="radio"
					id="soon"
					name="soon"
					onChange={handlePurchaseDate}
				/>
				<label htmlFor="soon">Soon</label>
			</div>
			<div>
				<input
					type="radio"
					id="kind-of-soon"
					name="kind-of-soon"
					onChange={handlePurchaseDate}
				/>
				<label htmlFor="kind-of-soon">Kind Of Soon</label>
			</div>
			<div>
				<input
					type="radio"
					id="not-soon"
					name="not-soon"
					onChange={handlePurchaseDate}
				/>
				<label htmlFor="not-soon">Not Soon</label>
			</div>
			<button type="submit">Add Item</button>
		</form>
	);
}
