import { ListItem } from '../components';

export function List({ data }) {
	console.log(data);

	// Q: const or let?
	const listItem = data.map((item) => {
		return <ListItem key={item.id} name={item.name} />;
	});

	return (
		<>
			<p>
				Hello from the <code>/list</code> page!
			</p>
			<ul>
				{/**
				 * TODO: write some JavaScript that renders the `data` array
				 * using the `ListItem` component that's imported at the top
				 * of this file.
				 */}
				{listItem}
			</ul>
		</>
	);
}
