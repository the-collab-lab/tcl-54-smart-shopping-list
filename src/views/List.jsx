import { ListItem } from '../components';
import { useState } from 'react';

/** List component that displays items in a user's shopping cart  */
export function List({ data }) {
	// const [filteredList, setFilteredList] = useState(null)
	const [filterInput, setFilterInput] = useState(null);

	const handleInput = (event) => {
		const value = event.target.value;
		setFilterInput(value);
		console.log(value);
		data.map((item) => {
			const name = item.name;
			name.includes(value)
				? console.log(name)
				: // return <ListItem key={item.id} name={item.name} />
				  console.log("This isn't working");
		});
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
				{/* { if (!filterInput) {
					data.map((item) => {
						return <ListItem key={item.id} name={item.name} />
					})} else {
						data.map((item) => {
							const name = item.name;
							name.includes(filterInput) ? console.log(name)
							// return <ListItem key={item.id} name={item.name} />
							: console.log("This isn't working")
						})
					}
				} */}
			</ul>
		</>
	);
}
