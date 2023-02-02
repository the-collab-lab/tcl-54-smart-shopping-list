import { ListItem } from '../components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/** List component that displays items in a user's shopping cart  */
export function List({ data }) {
	const [filteredList, setFilteredList] = useState([]);
	const [filterInput, setFilterInput] = useState('');

	/* Declare navigate for view redirection */
	const navigate = useNavigate();

	/* Use handler to change the state of filterInput  and convert all items to lowercase to facilitate a more thorough search */
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

	const handleAddItem = () => {
		/* navigate to add item view */
		navigate('/add-item');
	};

	return data.length == 1 ? (
		/* If list is empty, a welcoming user prompt is displayed to start adding items to the list */
		<>
			<p>
				<strong>Add items to start your shopping list</strong>
			</p>
			<p>Once you add an item, your shopping list will appear here.</p>
			<button onClick={handleAddItem}>Add items</button>
		</>
	) : (
		/* If list contains items, the shopping list is displayed including the item filtering feature */
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
					? data.map((item) => {
							return (
								<ListItem
									key={item.id}
									itemId={item.id}
									name={item.name}
									dateLastPurchased={item.dateLastPurchased}
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
								/>
							);
					  })}
			</ul>
		</>
	);
}
