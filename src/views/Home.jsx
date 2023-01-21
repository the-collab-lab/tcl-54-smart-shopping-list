import './Home.css';
import toast, { Toaster } from 'react-hot-toast';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewList } from '../api/firebase';

/** Home component that redirects a user to the List view if there is already a list created.
 * If the user doesn't already have a list, a user can create one to be saved to Firestore and be redirected to the List view. */

export function Home({ setListToken }) {
	// Declaring navigate for view redirection and errorNotify for error handling.
	const navigate = useNavigate();
	const errorNotify = () => toast.error('Error creating new shopping list ');

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
				errorNotify();
			});
	};

	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<button onClick={createNewToken}>Create a new list</button>
			<Toaster />
		</div>
	);
}
