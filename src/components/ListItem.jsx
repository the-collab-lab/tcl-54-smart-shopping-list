import './ListItem.css';

export function ListItem({ name }) {
	return (
		<li className="ListItem">
			<label>
				<input value={name} type="checkbox" />
				{name}
			</label>
		</li>
	);
}
