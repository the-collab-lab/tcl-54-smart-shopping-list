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

	/* This function will return:
	- True if the updated urgency list has more than one item
	- False if the list has one item or less*/
	const checkForMoreThanOneItem = () => {
		return dataWithUrgency.length > 1 ? true : false;
	};

	const handleClick = (e) => {
		e.preventDefault();
		setFilterInput('');
	};

	/*Handles navigation to Add Item view */
	const handleAddItem = () => {
		navigate('/add-item');
	};

	//Function to assign string value to buyingUrgency and color value to colorUrgency
	const getBuyingUrgency = (item) => {
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
				imgUrgency = 'src/img/bread_styling/inactive-loaf.svg';
			} else if (new Date() > item.dateNextPurchased.toDate()) {
				imgUrgency = 'src/img/bread_styling/overdue-loaf.svg';
			} else if (daysUntilNextPurchase >= 30) {
				imgUrgency = 'src/img/bread_styling/not-soon-loaf.svg';
			} else if (daysUntilNextPurchase > 7 && daysUntilNextPurchase < 30) {
				imgUrgency = 'src/img/bread_styling/kind-of-soon-loaf.svg';
			} else {
				imgUrgency = 'src/img/bread_styling/soon-loaf.svg';
			}
		}

		//To be used as new additions to item properties in the new shopping list dataWithUrgency
		return { imgUrgency };
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

	const renderList = () => {
		return !filterInput ? (
			// map over the sorted dataWithUrgency
			dataWithUrgency.map((item) => {
				return (
					<div className="item-card" key={item.id}>
						<ListItem
							keyField={item.id}
							itemId={item.id}
							name={item.name}
							dateLastPurchased={item.dateLastPurchased}
							dateNextPurchased={item.dateNextPurchased}
							urgency={item.urgency}
						/>
					</div>
				);
			})
		) : filterInput && filteredList.length === 0 ? (
			<div className="item-not-found">
				<Image src="src/img/bread_styling/confused-bread.png" />
				<h4>no matching item found</h4>
			</div>
		) : (
			filteredList.map((item) => {
				return (
					<div className="item-card" key={item.id}>
						<ListItem
							keyField={item.id}
							itemId={item.id}
							name={item.name}
							dateLastPurchased={item.dateLastPurchased}
							dateNextPurchased={item.dateNextPurchased}
							urgency={item.urgency}
						/>
					</div>
				);
			})
		);
	};

	if (loading) {
		return;
	} else {
		return checkForEmptyList() ? (
			/* If true that list is empty, 
			a welcoming user prompt is displayed to start adding items to the list */
			<div className="empty-list-view">
				<Card>
					<Card.Img src="src/img/bread_styling/oven.svg" alt="Card image" />
					<Card.ImgOverlay>
						<div className="oven-handle" />
						<div className="card-overlay-background">
							<Image src="src/img/bread_styling/sad-pastry.png" />
							<Card.Title>List is empty.</Card.Title>
							<Card.Subtitle>
								Stop loafing around, and start shopping!
							</Card.Subtitle>
							<Button type="button" onClick={handleAddItem} variant="primary">
								Add items
							</Button>
						</div>
					</Card.ImgOverlay>
				</Card>
			</div>
		) : (
			/* If false that list contains items,
			 the shopping list is displayed including the item filtering feature */
			<div className="filled-list-view">
				{/* if the shopping list has more than one item, the search bar is displayed */}
				{checkForMoreThanOneItem() ? (
					<div className="search-bar">
						<Form>
							<InputGroup>
								<InputGroup.Text>
									<Image src="src/img/icons/search-icon.svg" />
								</InputGroup.Text>
								<Form.Control
									id="list-filter"
									type="text"
									placeholder="Search items"
									value={filterInput}
									onChange={handleInput}
								/>
								{filterInput && <Button onClick={handleClick}>X</Button>}
							</InputGroup>
						</Form>
					</div>
				) : null}
				{/* conditional will display three options within ListGroup through renderList():
					- unfiltered shopping list
					- filtered shopping list
					- item not found view */}
				<Card>
					<Card.Img src="src/img/bread_styling/oven.svg" alt="Card image" />
					<Card.ImgOverlay>
						<div className="list-overflow">
							<ListGroup>{renderList()}</ListGroup>
						</div>
					</Card.ImgOverlay>
				</Card>
			</div>
		);
	}
}
