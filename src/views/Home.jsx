import './Home.css';
import toast, { Toaster } from 'react-hot-toast';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewList } from '../api/firebase';
//ad test
import { getItemData, streamListItems } from '../api';

/** Home component that redirects a user to the List view if there is already a list created.
 * If the user doesn't already have a list, a user can create one to be saved to Firestore and be redirected to the List view. */

export function Home({ setListToken }) {
	//
	const [joinToken, setJoinToken] = useState('');

	// Declaring navigate for view redirection and listCreateError for error handling.
	const navigate = useNavigate();
	const listCreateError = () => toast.error('Error creating new shopping list');
	const listJoinError = () => toast.error('This shopping list does not exist');

	//Checks for shopping list token in local storage and redirects to list view if it exists.
	const checkStorage = (key) => {
		const storedToken = localStorage.getItem(key);
		if (storedToken) {
			navigate('/list');
		}
	};

	//Calls checkStorage function when component is mounted.
	useEffect(() => {
		checkStorage('tcl-shopping-list-token');
	}, []);

	//Generates and saves new shopping list token.
	const createNewToken = async () => {
		const newToken = generateToken();
		createNewList(newToken)
			.then(() => {
				setListToken(newToken);
				navigate('/list');
			})
			.catch((error) => {
				listCreateError();
			});
	};

	// Join existing shopping list
	const joinExistingToken = async (e) => {
		e.preventDefault();
		console.log('token:', joinToken);

		//to do: reset input to null

		//Check if collection shopping list token exists
		streamListItems(joinToken, (snapshot) => {
			const shoppingListItems = getItemData(snapshot);
			console.log(snapshot);
			console.log(shoppingListItems);
			if (shoppingListItems[0]) {
				console.log('shopping list exists');
				setListToken(joinToken);
				navigate('/list');
			} else {
				console.log('shopping list does not exists');
				listJoinError();
			}
		});
	};

	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<button onClick={createNewToken}>Create a new list</button>
			<p>- or -</p>
			<p>Join an existing shopping list by entering a three word token.</p>
			<form id="join-shopping-list-form" onSubmit={joinExistingToken}>
				<label htmlFor="join-token">Share Token</label>
				<div>
					<input
						type="text"
						name="token"
						id="join-token"
						placeholder="three word token"
						onChange={(e) => setJoinToken(e.target.value)}
					/>
				</div>
				<div>
					<button type="submit" id="submit">
						Join an existing list
					</button>
				</div>
			</form>
			<Toaster />
		</div>
	);
}
