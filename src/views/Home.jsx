import './Home.css';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewList } from '../api/firebase';

/** Home component that redirects a user to the List view if there is already a list created.
 * If the user doesn't already have a list, a user can create one to be saved to Firestore and be redirected to the List view. */

export function Home({ listToken, setListToken }) {
	const navigate = useNavigate();

	useEffect(() => {
		if (listToken) {
			navigate('/list');
		}
	}, []);

	const createNewToken = async () => {
		const newToken = generateToken();
		setListToken(newToken);
		createNewList(newToken);
		navigate('/list');
	};

	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<button onClick={createNewToken}>Create a new list</button>
		</div>
	);
}
