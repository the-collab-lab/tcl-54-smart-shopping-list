import { addItem } from '../api/firebase';
import { useState } from 'react';

export function AddItem({ listId }) {
	const [itemData, setItemData] = useState({
		itemName: '',
		daysUntilNextPurchase: null,
	});
	/*
	itemData = {
		itemName:
		daysUntilNextPurchase:
	}
	*/

	const onFormSubmit = (event) => {
		event.preventDefault();
		addItem(listId, itemData);
		console.log(itemData);
	};

	const handleItemName = (event) => {
		setItemData({
			itemName: event.target.value,
		});
		console.log(event.target.value);
	};

	const handlePurchaseDate = (event) => {
		let date = null;
		if (event.target.name === 'soon') {
			date = 7;
			console.log('clicked 7');
		} else if (event.target.name === 'kind-of-soon') {
			date = 14;
			console.log('clicked 14');
		} else if (event.target.name === 'not-soon') {
			date = 30;
			console.log('clicked 30');
		}
		setItemData({
			daysUntilNextPurchase: date,
		});
	};

	return (
		<form onSubmit={onFormSubmit}>
			<div>Item name:</div>
			<input type="text" name="item" onChange={handleItemName} />
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
					name="soon"
					onChange={handlePurchaseDate}
				/>
				<label htmlFor="not-soon">Not Soon</label>
			</div>
			<button type="submit">Add Item</button>
		</form>
	);
}
// add radio buttons that correspond to soon, kind of soon, not soon
// Add form that allows user to add item name
// soon = 7 days
// kind of soon = 14
// not soon = 30

// add label for each input (radio button)
// submit button
