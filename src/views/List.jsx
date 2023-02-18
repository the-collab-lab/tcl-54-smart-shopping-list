import { ListItem } from '../components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { comparePurchaseUrgency } from '../api/firebase';
import { getDaysBetweenDates } from '../utils/dates';

/** List component that displays items in a user's shopping cart  */
export function List({ data, loading }) {
	const [filteredList, setFilteredList] = useState([]);
	const [filterInput, setFilterInput] = useState('');

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

	const handleClick = (e) => {
		e.preventDefault();
		setFilterInput('');
	};

	/*Handles navigation to Add Item view */
	const handleAddItem = () => {
		navigate('/add-item');
	};

	//Function to assign string value to buyingUrgency and color value to colorUrgency
	const getBuyingUrgency = (item) => {
		//Returns the difference between the currentDate and dateNextPurchased
		let buyingUrgency;
		let colorUrgency;

		if (item.dateNextPurchased) {
			let daysUntilNextPurchase = getDaysBetweenDates(
				new Date(),
				item.dateNextPurchased.toDate(),
			);

			//Conditional statement to categorize if an item is:
			// - inactive: (60 days have passed since the last purchase)
			// - overdue: currentDate has passed the dateNextPurchased, but not yet inactive
			// - not soon: (30 days or more until the next purchase)
			// - kind of soon: (between 7 & 30 days until the next purchase)
			// - soon: (7 days or fewer until the next purchase)
			if (daysUntilNextPurchase >= 60) {
				buyingUrgency = 'inactive';
				colorUrgency = '#878E88';
			} else if (new Date() > item.dateNextPurchased.toDate()) {
				buyingUrgency = 'overdue';
				colorUrgency = '#A30000';
			} else if (daysUntilNextPurchase >= 30) {
				buyingUrgency = 'not soon';
				colorUrgency = '#004777';
			} else if (daysUntilNextPurchase > 7 && daysUntilNextPurchase < 30) {
				buyingUrgency = 'kind of soon';
				colorUrgency = '#00AFB5';
			} else {
				buyingUrgency = 'soon';
				colorUrgency = '#FF7700';
			}
		}

		return { buyingUrgency, colorUrgency };
	};

	/* Sorting the shopping list items by urgency */
	let dataWithUrgency = data
		.filter((item) => item.hasOwnProperty('name'))
		.map((item) => ({
			...item,
			urgency: getBuyingUrgency(item),
		}))
		.sort(comparePurchaseUrgency);

	/* Use handler to change the state of filterInput 
	and convert all items to lowercase to facilitate a more thorough search */
	const handleInput = (event) => {
		const value = event.target.value.toLowerCase().trim();
		setFilterInput(value);
		setFilteredList(
			dataWithUrgency.filter((item) => {
				return item.name && item.name.toLowerCase().includes(value);
			}),
		);
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
						? // map over the sorted dataWithUrgency
						  dataWithUrgency.map((item) => {
								return (
									<ListItem
										key={item.id}
										itemId={item.id}
										name={item.name}
										dateLastPurchased={item.dateLastPurchased}
										dateNextPurchased={item.dateNextPurchased}
										urgency={item.urgency}
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
										urgency={item.urgency}
									/>
								);
						  })}
				</ul>
			</>
		);
	}
}
