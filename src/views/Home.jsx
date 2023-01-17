import './Home.css';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//ad:
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../api/config';

export function Home({ listToken, setListToken }) {
	const navigate = useNavigate();
	const [newToken, setNewToken] = useState('');

	useEffect(() => {
		if (listToken) {
			console.log(listToken);
			navigate('/list');
			addDoc(collection(db, listToken), {
				id: Date.now(),
			});
		}
	});

	// function newTokenCreateAndSave() {
	// 	const result = setListToken(generateToken());
	// 	console.log(result);
	// addDoc(collection(db, listToken), {
	// 		id: Date.now(),
	// });
	// 	navigate('/list');
	// }

	// const newTokenCreateAndSave = async () => {
	// 	setListToken(generateToken());

	// 	addDoc(collection(db, listToken), {
	// 		id: Date.now(),
	// 	});

	// 	(navigate('/list'));
	// };

	function createNewToken() {
		setListToken(generateToken());
		// navigate('/list');
	}

	// function saveNewToken() {
	// 	console.log(listToken);
	// 			addDoc(collection(db, listToken), {
	// 			id: Date.now(),
	// 	});
	// }

	// function newTokenCreateAndSave() {
	// 	createNewToken();
	// 	saveNewToken();
	// }

	//ad test
	// const newTokenCreateAndSave = async () => {
	// 	await setNewToken(generateToken());
	// 	console.log(newToken);

	// 	setListToken(newToken);
	// 	console.log(listToken)

	// 	addDoc(collection(db, newToken), {
	// 		id: Date.now(),
	// 	});

	// 	(navigate('/list'));
	// };

	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<button onClick={createNewToken}>Create a new list</button>
		</div>
	);
}
