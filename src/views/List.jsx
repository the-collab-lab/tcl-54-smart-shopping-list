import { ListItem } from '../components';
import { useState } from 'react';

/** List component that displays items in a user's shopping cart  */
export function List({ data }) {
	const [filteredList, setFilteredList] = useState(null);
	const [filterInput, setFilterInput] = useState(null);

	const handleInput = (event) => {
		const value = event.target.value;
		setFilterInput(value);
		setFilteredList(data.filter((item) => item.name.includes(value)));
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
					type="text"
					placeholder="Start typing here..."
					onChange={handleInput}
				/>
			</form>

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
