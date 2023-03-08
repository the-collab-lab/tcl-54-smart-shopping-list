import toast, { Toaster } from 'react-hot-toast';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewList, listExists } from '../api/firebase';
import { Button, Form, Image, InputGroup } from 'react-bootstrap';
import appImage from '../img/bread-styling/burger-boy1.png';
import LearnModal from '../components/LearnModal';

/** Home component that redirects a user to the List view if there is already a list created.
 * If the user doesn't already have a list, a user can create a list or join one to be saved to Firestore and be redirected to the List view. */

export function Home({ setListToken }) {
	// Declare useState variable for user shared token input
	const [joinToken, setJoinToken] = useState('');
	// Declare state used for showing/hiding the modal
	const [show, setShow] = useState(false);

	// Declare navigate for view redirection
	const navigate = useNavigate();

	// Declare error notifying functions using react-hot-toast.
	const listCreateError = () => toast.error('Error creating new shopping list');
	const listJoinError = () => toast.error('This shopping list does not exist');
	const blankListError = () =>
		toast.error('Shopping list token cannot be blank');
	const firebaseError = (error) =>
		toast.error('Error: Unable to connect to the database', error);
	const joinTokenSpacesError = () =>
		toast.error('The share token spacing is incorrect');

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

		//Checks if the share token input is blank
		if (joinToken.trim() === '') {
			blankListError();
			//Checks if the share token word spacing is correct
		} else if (
			joinToken
				.trim()
				.split(' ')
				.filter((part) => part !== '').length !== 3
		) {
			joinTokenSpacesError();
			//If the share token words are correctly spaced the default option is to check if it exists in storage
		} else {
			// Then listExists is imported from firebase.js to query
			// the database for an existing shopping list collection.
			// The then() method is expecting a boolean, where if `exists`
			// is true the share token was found and if false the token does not exist
			listExists(joinToken)
				.then((exists) => {
					if (exists) {
						setListToken(joinToken);
						navigate('/list');
					} else {
						setJoinToken('');
						listJoinError();
					}
				})
				.catch((error) => {
					firebaseError(error);
				});
		}
	};

	return (
		<div className="home my-5 text-center">
			<h5 className="mb-2">Welcome to</h5>
			<h1 className="fw-bold mb-4">Knead to Buy</h1>
			<div className="app-logo mx-auto mb-4">
				<Image src={appImage} alt="app logo" />
			</div>
			<p className="app-summary mb-5 px-3 fs-6 mx-auto">
				Get a bread start on your shopping as the app learns your buying habits.
				<br />
				When it comes to remembering what to buy next, Knead to Buy is "second
				to naan"!
			</p>
			<div className="text-center">
				<Button onClick={createNewToken} className="btn-custom mb-3">
					Create a new list
				</Button>
				<p>
					<strong>- or -</strong>{' '}
				</p>
				<Form id="join-shopping-list-form" onSubmit={joinExistingToken}>
					<Form.Label htmlFor="join-token" className="mb-1">
						List Token
					</Form.Label>
					<div className="d-flex flex-row justify-content-center m-auto home-input ">
						<InputGroup className="w-75 mb-5">
							<Form.Control
								type="text"
								name="join-token"
								id="join-token"
								value={joinToken}
								placeholder="three word token"
								onChange={(e) => setJoinToken(e.target.value)}
							/>
							<Button
								type="submit"
								id="submit-share-token"
								className="btn-custom"
							>
								Join List
							</Button>
						</InputGroup>
					</div>
				</Form>
				<hr className="mb-5 m-auto" />
				{/* When Learn More is clicked the state for `show` is set to true */}
				<div className="learn-more fw-bold">
					<a href="/#" onClick={() => setShow(true)} aria-label="Open modal">
						Learn More
					</a>
				</div>
			</div>
			{/** This is the imported modal, to which we pass the state of `show`, which will show the modal.
			 * The `hide` prop takes a false, which will be used to hide the modal.
			 */}
			<LearnModal show={show} hide={() => setShow(false)} />
			<Toaster />
		</div>
	);
}
