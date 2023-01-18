import { addItem } from '../api/firebase';
import { useState } from 'react';

export function AddItem({ listId }) {
	//separated two data items of name and purchase date
	const [itemName, setItemName] = useState('');

	const [daysUntilNextPurchase, setdaysUntilNextPurchase] = useState(null);

	// Stored itemName and daysUntilNextPurchase inside object and sent to database

	const onFormSubmit = (event) => {
		event.preventDefault();
		const itemData = { itemName, daysUntilNextPurchase };
		addItem(listId, itemData);
	};

	// Take user input and set itemName
	const handleItemName = (event) => {
		setItemName(event.target.value);
	};

	// Take radio selection and daysUntilNextPurchase
	const handlePurchaseDate = (event) => {
		let date = null;
		if (event.target.name === 'soon') {
			date = 7;
			console.log('clicked soon');
		} else if (event.target.name === 'kind-of-soon') {
			date = 14;
			console.log('clicked kind of soon');
		} else if (event.target.name === 'not-soon') {
			date = 30;
			console.log('clicked not soon');
		}
		setdaysUntilNextPurchase(date);
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
