import { ListItem } from '../components';

/** List component that displays items in a user's shopping cart  */
export function List({ data }) {
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
				/>
			</form>

			<ul>
				{data.map((item) => {
					return <ListItem key={item.id} name={item.name} />;
				})}
			</ul>
		</>
	);
}
