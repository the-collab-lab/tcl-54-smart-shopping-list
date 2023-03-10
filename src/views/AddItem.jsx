// SVG Imports
import { ReactComponent as SoonToast } from '../img/bread-slices/soon-toast.svg';
import { ReactComponent as KindOfSoonToast } from '../img/bread-slices/kind-of-soon-toast.svg';
import { ReactComponent as NotSoonToast } from '../img/bread-slices/not-soon-toast.svg';
import { ReactComponent as Croissant } from '../img/bread-styling/croissant.svg';
import { addItem } from '../api/firebase';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Form, InputGroup, Container, Row, Col } from 'react-bootstrap';

/**
 * Allows user to add an item to their shopping list,
 * set the next estimated purchase date,
 * and store that to db
 */

export function AddItem({ listToken, data }) {
	// declare itemName, daysUntilNextPurchase, and radioSelect
	// into separate state variables
	const [itemName, setItemName] = useState('');
	const [daysUntilNextPurchase, setDaysUntilNextPurchase] = useState(7);

	// `itemRegex` is a regular expression that matches any sequence of characters
	// that does NOT include letters or digits
	const itemRegex = /[^a-zA-Z0-9]+/g;

	/* ↓↓ HOT TOAST NOTIFICATIONS ↓↓ */

	// Notify when adding item is unsuccessful
	const notifyFailedRequest = () => toast.error('Failed to add item');

	// Notify if the item the user enters in form already exists in db.
	// `reducedItemName` is the item name without spaces or special characters.
	// The user is notified with this pared down name.
	const notifyInList = (itemName) => {
		const reducedItemName = itemName.toLowerCase().replace(itemRegex, '');
		toast.error(`Looks like ${reducedItemName} is already on your list!`);
	};

	// Notify if user submits spaces (blank)
	const noBlanks = () => toast.error('No blanks may submitted');

	// Notify when adding item but there's no list token
	const notifyNoToken = () => toast.error('Please add a list token first');

	// Notify when adding item is successful
	const notifyItemAdded = (itemName) =>
		toast.success(`${itemName} was added to your list!`);

	// Store values inside itemData and sent over to database
	// otherwise log an error if request fails
	const onFormSubmit = (e) => {
		e.preventDefault();

		// if list token is not provided, notify user and exit function
		if (!listToken) {
			notifyNoToken();
			return;
		}

		// We are looking for an array of items that matches the user input.
		// We use `toLowerCase`, `replaceAll` and `itemRegex` to account for
		// all the edge cases: white space, letter case, and non-letters/non-digits.
		const nameMatchesArr = data.some((item) => {
			return (
				item.name &&
				item.name.toLowerCase().replaceAll(itemRegex, '') ===
					itemName.toLowerCase().replaceAll(itemRegex, '')
			);
		});

		// The user is notified if the input matches an item in db
		// Item does not get added; exits the function
		if (nameMatchesArr) {
			notifyInList(itemName);
			return;
		}

		// The user is notified if the input, after spaces trimmed, is length of 0
		// Exits the function
		if (itemName.trim().length === 0) {
			noBlanks();
			return;
		}

		// Updates the relevant data in db
		const itemData = {
			itemName,
			daysUntilNextPurchase,
		};

		// If the input has no match in db, the item is added, notifies the user,
		// and sets input back to empty string.
		// Errors are handled otherwise.
		try {
			addItem(listToken, itemData);
			setItemName('');
			notifyItemAdded(itemData.itemName);
		} catch (error) {
			notifyFailedRequest();
		}
	};

	// Get radio selection and set daysUntilNextPurchase
	const handlePurchaseDate = (event) => {
		const whenToPurchase = {
			soon: 7,
			'kind-of-soon': 14,
			'not-soon': 30,
		};
		const date = whenToPurchase[event.target.value];
		setDaysUntilNextPurchase(date);
	};

	return (
		<>
			<div className="add-item d-flex flex-column">
				<header className="text-center mt-3">
					<h1 className="fw-bold">Add Item</h1>
				</header>

				<Container className="add-item-form shadow rounded-3 py-3 mt-5 bg-white">
					<Form onSubmit={onFormSubmit}>
						<div className="py-4 mx-5">
							<Form.Label htmlFor="item">Item Name:</Form.Label>
							<InputGroup>
								<Form.Control
									type="text"
									id="item"
									name="item"
									value={itemName}
									onChange={(e) => setItemName(e.target.value)}
									required={true}
									placeholder="e.g., croissants"
									className="item-input rounded-2"
								/>
							</InputGroup>
						</div>
						<div className="pb-4 mx-5">
							<Form.Label>How soon will you buy this again?</Form.Label>
							<fieldset>
								<Row className="soon-row rounded-2 my-2 p-3">
									<Col xs={2} className="soon-radio-button rounded-start">
										<Form.Check
											defaultChecked
											aria-labelledby="purchase-date-label"
											type="radio"
											value="soon"
											id="soon"
											name="radio-btn"
											onChange={handlePurchaseDate}
											className="radio-button text-center align-middle"
										/>
									</Col>
									<Col xs={8}>
										<Form.Label
											className="radio-button-label fs-6"
											htmlFor="soon"
										>
											Soon
										</Form.Label>
									</Col>
									<Col xs={2}>
										<div className="urgency-toast">
											<SoonToast />
										</div>
									</Col>
								</Row>
								<Row className="kind-of-soon-row rounded-2 my-4 p-3">
									<Col
										xs={2}
										className="kind-of-soon-radio-button rounded-start"
									>
										<Form.Check
											type="radio"
											value="kind-of-soon"
											id="kind-of-soon"
											name="radio-btn"
											onChange={handlePurchaseDate}
											className="radio-button text-center align-middle"
										/>
									</Col>
									<Col xs={8}>
										<Form.Label
											className="radio-button-label fs-6"
											htmlFor="kind-of-soon"
										>
											Kind of Soon
										</Form.Label>
									</Col>
									<Col xs={2}>
										<div className="urgency-toast">
											<KindOfSoonToast />
										</div>
									</Col>
								</Row>
								<Row className="not-soon rounded-2 my-4 p-3">
									<Col xs={2} className="not-soon-radio-button rounded-start">
										<Form.Check
											type="radio"
											id="not-soon"
											value="not-soon"
											name="radio-btn"
											onChange={handlePurchaseDate}
											className="radio-button text-center align-middle"
										/>
									</Col>
									<Col xs={8}>
										<Form.Label
											className="radio-button-label fs-6"
											htmlFor="not-soon"
										>
											Not Soon
										</Form.Label>
									</Col>
									<Col xs={2}>
										<div className="urgency-toast">
											<NotSoonToast />
										</div>
									</Col>
								</Row>
							</fieldset>
						</div>
						<div className="mb-4 text-center">
							<Button className="btn-custom" type="submit">
								Add Item
							</Button>
						</div>
					</Form>
				</Container>
				<div className="mt-5 w-25 mx-auto ">
					<Croissant />
				</div>
			</div>

			<Toaster />
		</>
	);
}
