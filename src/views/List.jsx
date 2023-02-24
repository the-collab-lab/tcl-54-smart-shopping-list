import { ListItem } from '../components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { comparePurchaseUrgency } from '../api/firebase';
import { getDaysBetweenDates } from '../utils/dates';
import {
	Button,
	InputGroup,
	Form,
	ListGroup,
	Card,
	Image,
} from 'react-bootstrap';

/** List component that displays items in a user's shopping cart  */
export function List({ data, loading }) {
	const [filteredList, setFilteredList] = useState([]);
	const [filterInput, setFilterInput] = useState('');

	/* Declare navigate for view redirection */
	const navigate = useNavigate();

	/* This function will return:
	- True if the list is empty
	- False if the list has a length other than zero.*/
	const checkForEmptyList = () => {
		/*New collections created in Firestore automatically have one empty id.
		For this reason, the data has to be filtered for items with the name property.*/
		const shoppingListArr = data.filter((item) => item.name);
		return shoppingListArr.length === 0 ? true : false;
	};

	const handleClick = (e) => {
		e.preventDefault();
		setFilterInput('');
	};

	const renderList = () => {
		return !filterInput
			? // map over the sorted dataWithUrgency
			  dataWithUrgency.map((item) => {
					return (
						<ListItem
							key={item.id}
							itemId={item.id}
							name={item.name}
							dateLastPurchased={item.dateLastPurchased}
							dateNextPurchased={item.dateNextPurchased}
							urgency={item.urgency}
						/>
					);
			  })
			: filterInput && filteredList.length === 0
			? 'no matching item found'
			: filteredList.map((item) => {
					return (
						<ListItem
							key={item.id}
							itemId={item.id}
							name={item.name}
							dateLastPurchased={item.dateLastPurchased}
							dateNextPurchased={item.dateNextPurchased}
							urgency={item.urgency}
						/>
					);
			  });
	};

	/*Handles navigation to Add Item view */
	const handleAddItem = () => {
		navigate('/add-item');
	};

	//Function to assign string value to buyingUrgency and color value to colorUrgency
	const getBuyingUrgency = (item) => {
		let buyingUrgency;
		let colorUrgency;
		let imgUrgency;

		//To filter for non-empty items, if an item exists in the data and has a
		//dateNextPurchased value, that item will be assigned a daysUntilNextPurchase value.
		if (item.dateNextPurchased) {
			let daysUntilNextPurchase = getDaysBetweenDates(
				new Date(),
				item.dateNextPurchased.toDate(),
			);

			//Conditional statement to categorize if an item is:
			// - inactive: (60 days have passed since the last purchase)
			// - overdue: currentDate has passed the dateNextPurchased, but not yet inactive
			// - not soon: (30 days or more until the next purchase)
			// - kind of soon: (between 7 & 30 days until the next purchase)
			// - soon: (7 days or fewer until the next purchase)
			if (daysUntilNextPurchase >= 60) {
				buyingUrgency = 'inactive';
				colorUrgency = '#878E88';
				imgUrgency = '../img/bread_styling/inactive-loaf.svg/';
			} else if (new Date() > item.dateNextPurchased.toDate()) {
				buyingUrgency = 'overdue';
				colorUrgency = '#CD001A';
				imgUrgency = '../img/bread_styling/overdue-loaf.svg/';
			} else if (daysUntilNextPurchase >= 30) {
				buyingUrgency = 'not soon';
				colorUrgency = '#00AFB5';
				imgUrgency = '../img/bread_styling/not-soon-loaf.svg/';
			} else if (daysUntilNextPurchase > 7 && daysUntilNextPurchase < 30) {
				buyingUrgency = 'kind of soon';
				colorUrgency = '#FFB81C';
				imgUrgency = '../img/bread_styling/kind-of-soon-loaf.svg/';
			} else {
				buyingUrgency = 'soon';
				colorUrgency = '#FF7700';
				imgUrgency = '../img/bread_styling/soon-loaf.svg/';
			}
		}

		//To be used as new additions to item properties in the new shopping list dataWithUrgency
		return { buyingUrgency, colorUrgency, imgUrgency };
	};

	/* Sorting the shopping list items by urgency using the following steps:
		- filter() to use items that are non-empty
		- map() to create a new array using the existing shopping items ,
			and adding the urgency properties of buyingUrgency and colorUrgency to urgency key.
		- sort() to utilize the comparePurchaseUrgency function created in firebase to sort items by urgency
	*/
	let dataWithUrgency = data
		.filter((item) => item.hasOwnProperty('name'))
		.map((item) => ({
			...item,
			urgency: getBuyingUrgency(item),
		}))
		.sort(comparePurchaseUrgency);

	/* Use handler to change the state of filterInput 
	and convert all items to lowercase to facilitate a more thorough search */
	const handleInput = (event) => {
		const value = event.target.value;
		setFilterInput(value);
		setFilteredList(
			dataWithUrgency.filter((item) => {
				return (
					item.name &&
					item.name.toLowerCase().includes(value.toLowerCase().trim())
				);
			}),
		);
	};

	if (loading) {
		return;
	} else {
		return checkForEmptyList() ? (
			/* If true that list is empty, 
			a welcoming user prompt is displayed to start adding items to the list */
			<>
				<Card className="border-0 bg-transparent">
					<Card.Img src="../img/bread_styling/oven.svg/" alt="Card image" />
					<Card.ImgOverlay style={{ paddingTop: '20%' }}>
						<Card.Text className="overflow-auto" style={{ maxHeight: '100%' }}>
							<Image
								src="../img/bread_styling/sad-pastry.png"
								style={{ width: '50%', paddingTop: '15%' }}
								className="rounded mx-auto d-block"
							/>
							<h1>Your list is empty.</h1>
							<h2>Stop loafing around, and start shopping!</h2>
							<Button onClick={handleAddItem} variant="primary">
								Add items
							</Button>
						</Card.Text>
					</Card.ImgOverlay>
				</Card>
			</>
		) : (
			/* If false that list contains items,
			 the shopping list is displayed including the item filtering feature */

			<>
				<Form>
					{/* <Form.Label htmlFor="list-filter">Filter items</Form.Label>
					<br /> */}
					<InputGroup>
						<Form.Control
							id="list-filter"
							type="text"
							placeholder="Search items"
							value={filterInput}
							onChange={handleInput}
						/>
						{filterInput && (
							<Button onClick={handleClick} variant="outline-primary">
								X
							</Button>
						)}
					</InputGroup>
				</Form>
				{/* Card is used for the oven image to be used as a background for the shopping list items */}
				{/* border-0 and bg-transparent removes the encasing border and background color of a card
					so that the oven image is the sole display */}
				<Card className="border-0 bg-transparent">
					<Card.Img src="../img/bread_styling/oven.svg/" alt="Card image" />
					<Card.ImgOverlay style={{ paddingTop: '20%' }}>
						<Card.Text className="overflow-auto" style={{ maxHeight: '100%' }}>
							<ListGroup>
								{!filterInput
									? // map over the sorted dataWithUrgency
									  dataWithUrgency.map((item) => {
											return (
												<>
													<ListItem
														key={item.id}
														itemId={item.id}
														name={item.name}
														dateLastPurchased={item.dateLastPurchased}
														dateNextPurchased={item.dateNextPurchased}
														urgency={item.urgency}
													/>
												</>
											);
									  })
									: filteredList.map((item) => {
											return (
												<ListItem
													key={item.id}
													itemId={item.id}
													name={item.name}
													dateLastPurchased={item.dateLastPurchased}
													dateNextPurchased={item.dateNextPurchased}
													urgency={item.urgency}
												/>
											);
									  })}
							</ListGroup>
						</Card.Text>
					</Card.ImgOverlay>
				</Card>
			</>
		);
	}
}
