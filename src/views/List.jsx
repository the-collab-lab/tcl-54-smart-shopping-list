import { ListItem } from '../components';
import { useState } from 'react';

/** List component that displays items in a user's shopping cart  */
export function List({ data }) {
	const [filteredList, setFilteredList] = useState([]);
	const [filterInput, setFilterInput] = useState('');

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

	return (
		<>
			<p>
				Hello from the <code>/list</code> page!
			</p>

			<form>
				<label htmlFor="list-filter">Filter items</label>
				<br />
				<input
					id="list-filter"
					type="search"
					placeholder="Start typing here..."
					onChange={handleInput}
				/>
			</form>
			{/* Uses data or state of filteredList depending on state of filterInput */}
			<ul>
				{!filterInput
					? data.map((item) => {
							return <ListItem key={item.id} name={item.name} />;
					  })
					: filteredList.map((item) => {
							return <ListItem key={item.id} name={item.name} />;
					  })}
			</ul>
		</>
	);
}
