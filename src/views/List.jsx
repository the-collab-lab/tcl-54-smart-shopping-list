import { ListItem } from '../components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { comparePurchaseUrgency } from '../api/firebase';
import { getDaysBetweenDates } from '../utils/dates';

/** List component that displays items in a user's shopping cart  */
export function List({ data, loading }) {
	const [filteredList, setFilteredList] = useState([]);
	const [filterInput, setFilterInput] = useState('');

	// **** TEST
	const urgencyData = data
		.filter((item) => item.name)
		.sort(comparePurchaseUrgency);

	console.log('Urgency sorted data: ', urgencyData);
	console.log(
		'ugency data days until next purchase: ',
		urgencyData.map((item) => {
			//Use getDaysBetweenDates to find the difference between dateLastPurchased and dateNextPurchased
			const daysSinceLastPurchased = getDaysBetweenDates(
				new Date(),
				item.dateNextPurchased.toDate(),
			);
			console.log(daysSinceLastPurchased);
			return item.name + item.dateNextPurchased.toDate();
		}),
	);

	/* Declare navigate for view redirection */
	const navigate = useNavigate();

	/* This function will return:
	- True if the list is empty
	- False if the list has a length other than zero.*/
	const checkForEmptyList = () => {
		/*New collections created in Firestore automatically have one empty id.
		For this reason, the data has to be filtered for items with the name property.*/
		const shoppingListArr = data.filter((item) => item.name);
		return shoppingListArr.length === 0 ? true : false;
	};

	/* Use handler to change the state of filterInput 
	and convert all items to lowercase to facilitate a more thorough search */
	const handleInput = (event) => {
		const value = event.target.value.toLowerCase().trim();
		setFilterInput(value);
		setFilteredList(
			data.filter((item) => {
				return item.name && item.name.toLowerCase().includes(value);
			}),
		);
	};

	const handleClick = (e) => {
		e.preventDefault();
		setFilterInput('');
	};

	/*Handles navigation to Add Item view */
	const handleAddItem = () => {
		navigate('/add-item');
	};

	if (loading) {
		return;
	} else {
		return checkForEmptyList() ? (
			/* If true that list is empty, 
			a welcoming user prompt is displayed to start adding items to the list */
			<>
				<p>
					<strong>Add items to start your shopping list</strong>
				</p>
				<p>Once you add an item, your shopping list will appear here.</p>
				<button onClick={handleAddItem}>Add items</button>
			</>
		) : (
			/* If false that list contains items,
			 the shopping list is displayed including the item filtering feature */

			<>
				<p>
					Hello from the <code>/list</code> page!
				</p>

				<form>
					<label htmlFor="list-filter">Filter items</label>
					<br />
					<div>
						<input
							id="list-filter"
							type="text"
							placeholder="Start typing here..."
							value={filterInput}
							onChange={handleInput}
						/>
						{filterInput && <button onClick={handleClick}>X</button>}
					</div>
				</form>
				{/* Uses data or state of filteredList depending on state of filterInput */}
				<ul>
					{!filterInput
						? urgencyData.map((item) => {
								return (
									<ListItem
										key={item.id}
										itemId={item.id}
										name={item.name}
										dateLastPurchased={item.dateLastPurchased}
										dateNextPurchased={item.dateNextPurchased}
									/>
								);
						  })
						: filteredList.map((item) => {
								return (
									<ListItem
										key={item.id}
										itemId={item.id}
										name={item.name}
										dateLastPurchased={item.dateLastPurchased}
										dateNextPurchased={item.dateNextPurchased}
									/>
								);
						  })}
				</ul>
			</>
		);
	}
}
