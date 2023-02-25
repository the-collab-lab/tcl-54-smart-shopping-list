import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AddItem, Home, Layout, List } from './views';

import { getItemData, streamListItems } from './api';
import { useStateWithStorage } from './utils';

export function App() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	/**
	 * Here, we're using a custom hook to create `listToken` and a function
	 * that can be used to update `listToken` later.
	 *
	 * The `listToken` is set to `null` by default since new users do not have tokens.
	 * We use `setListToken` to allow a user to create and join a new list.
	 */
	const [listToken, setListToken] = useStateWithStorage(
		null,
		'tcl-shopping-list-token',
	);

	useEffect(() => {
		if (!listToken) return;
		/**
		 * streamListItems` takes a `listToken` so it can commuinicate
		 * with our database, then calls a callback function with
		 * a `snapshot` from the database.
		 *
		 * Refer to `api/firebase.js`.
		 */
		return streamListItems(listToken, (snapshot) => {
			/**
			 * Here, we read the documents in the snapshot and do some work
			 * on them, so we can save them in our React state.
			 *
			 * Refer to `api/firebase.js`
			 */
			const nextData = getItemData(snapshot);

			/** Finally, we update our React state. */
			setData(nextData);
			/* Once data is pulled, the loading state will be set to
			false so that the loading view will disappear wherever it's pulled*/
			setLoading(false);
		});
	}, [listToken]);

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Layout listToken={listToken} />}>
					<Route index element={<Home setListToken={setListToken} />} />
					<Route
						path="/list"
						element={<List data={data} loading={loading} />}
					/>
					<Route
						path="/add-item"
						element={<AddItem listToken={listToken} data={data} />}
					/>
				</Route>
			</Routes>
		</Router>
	);
}
