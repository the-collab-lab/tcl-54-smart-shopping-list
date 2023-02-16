import {
	collection,
	onSnapshot,
	addDoc,
	getDocs,
	query,
	doc,
	updateDoc,
	getDoc,
} from 'firebase/firestore';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { db } from './config';
import {
	getFutureDate,
	getDaysBetweenDates,
	ONE_DAY_IN_MILLISECONDS,
} from '../utils/dates';

/**
 * Subscribe to changes on a specific list in the Firestore database (listId), and run a callback (handleSuccess) every time a change happens.
 * @param {string} listId The user's list token
 * @param {Function} handleSuccess The callback function to call when we get a successful update from the database.
 * @returns {Function}
 *
 * @see https://firebase.google.com/docs/firestore/query-data/listen
 */
export function streamListItems(listId, handleSuccess) {
	const listCollectionRef = collection(db, listId);
	return onSnapshot(listCollectionRef, handleSuccess);
}

/**
 * comparePurchaseUrgency CURRENT FUNCTIONS:
 * - sort for inactive items last, then
 * - sort to most urgent date next pruchased, then
 * - sorts to earliest alphabet name if date next purchased is the same
 *
 * TODO (STRETCH GOAL):
 * - sorts for overdue items to be listed at the top that aren't inactive
 */
export function comparePurchaseUrgency(item1, item2) {
	//gets the days until next purchase between current date and dateNextPurchased for item argument
	function getDaysUntilNextPurchase(item) {
		return getDaysBetweenDates(new Date(), item.dateNextPurchased.toDate());
	}

	//Inactive item conditional
	if (getDaysUntilNextPurchase(item1) >= 60) {
		return 1;
	}
	//Overdue item conditional
	if (new Date() > item1.dateNextPurchased.toDate()) {
		return -1;
	} else if (new Date() > item2.dateNextPurchased.toDate()) {
		return 1;
	}
	//Conditionals for days until next purchase and alphabetized if same number of days
	if (getDaysUntilNextPurchase(item1) < getDaysUntilNextPurchase(item2)) {
		return -1;
	} else if (
		getDaysUntilNextPurchase(item1) > getDaysUntilNextPurchase(item2)
	) {
		return 1;
	} else {
		if (item1.name < item2.name) {
			return -1;
		} else {
			return 1;
		}
	}
}

/**
 * Read the information from the provided snapshot and return an array
 * that can be stored in our React state.
 * @param {Object} snapshot A special Firebase document with information about the current state of the database.
 * @returns {Object[]} An array of objects representing the user's list.
 */
export function getItemData(snapshot) {
	/**
	 * Firebase document snapshots contain a `.docs` property that is an array of
	 * document references. We use `.map()` to iterate over them.
	 * @see https://firebase.google.com/docs/reference/js/firestore_.documentsnapshot
	 */
	return snapshot.docs.map((docRef) => {
		/**
		 * We call the `.data()` method to get the data
		 * out of the referenced document
		 */
		const data = docRef.data();

		/**
		 * The document's ID is not part of the data, but it's very useful
		 * so we get it from the document reference.
		 */
		data.id = docRef.id;
		return data;
	});
}

/**
 * Add a new item to the user's list in Firestore.
 * @param {string} listId The id of the list we're adding to.
 * @param {Object} itemData Information about the new item.
 * @param {string} itemData.itemName The name of the item.
 * @param {number} itemData.daysUntilNextPurchase The number of days until the user thinks they'll need to buy the item again.
 */
export async function addItem(listId, { itemName, daysUntilNextPurchase }) {
	const listCollectionRef = collection(db, listId);
	return await addDoc(listCollectionRef, {
		dateCreated: new Date(),
		// NOTE: This is null because the item has just been created.
		// We'll use updateItem to put a Date here when the item is purchased!
		dateLastPurchased: null,
		dateNextPurchased: getFutureDate(daysUntilNextPurchase),
		name: itemName,
		totalPurchases: 0,
	});
}

/**
 * Update an item in the user's list in Firestore.
 * @param {string} listId The id of the list that has the items we're updating.
 * @param {string} itemID The id of the list item we're updating.
 * @param {boolean} checked The check state from ListItem.jsx.
 *
 * This function updates an item's properties when an interaction
 * happens between the user and the item list
 */
export async function updateItem(listId, itemId, checked) {
	const listItemRef = doc(db, listId, itemId);
	const listItemSnap = await getDoc(listItemRef);

	// Retrieve item property values stored in Firebase
	let { totalPurchases, dateLastPurchased, dateCreated, dateNextPurchased } =
		listItemSnap.data();

	//This function returns the next purchase date in milliseconds
	function getNextPurchaseDate() {
		//If dateLastPurchased is null, then the dateLastUpdated value defaults to dateCreated
		const dateLastUpdated = dateLastPurchased ? dateLastPurchased : dateCreated;

		// The previous estimated interval is calculated by the interval between dateNextPurchased
		//	and the last purchase date (or date created if dateLastPurchased is null)
		const previousEstimate = getDaysBetweenDates(
			dateNextPurchased.toDate(),
			dateLastUpdated.toDate(),
		);

		// The number of days since the last transaction is calculated by the interval between
		//	the current date and the last purchase date (or date created if dateLastPurchased is null)
		const daysSinceLastTransaction = getDaysBetweenDates(
			new Date(),
			dateLastUpdated.toDate(),
		);

		// The estimated next purchase date is calculated by adding two values:
		//	- The current date in milliseconds
		//	- The estimated number of days until the next purchase converted into milliseconds
		const nextPurchaseDate = new Date(
			new Date().getTime() +
				calculateEstimate(
					previousEstimate,
					daysSinceLastTransaction,
					totalPurchases,
				) *
					ONE_DAY_IN_MILLISECONDS,
		);

		return nextPurchaseDate;
	}

	// This function sends updated values to Firestore
	await updateDoc(listItemRef, {
		// Updates dateLastPurchased to the time when the user checks off an item
		dateLastPurchased: new Date(),

		// This is calucated using calculateEstimate and added to the current date,
		// updating the next purchase date of an item
		dateNextPurchased: getNextPurchaseDate(),

		// Adds 1 to the total purchases of an item
		totalPurchases: totalPurchases + 1,
	});
}

export async function deleteItem() {
	/**
	 * TODO: Fill this out so that it uses the correct Firestore function
	 * to delete an existing item. You'll need to figure out what arguments
	 * this function must accept!
	 */
}

/** This function uses a new list token to create and save an empty new collection to Firestore.*/
export async function createNewList(newListToken) {
	await addDoc(collection(db, newListToken), {});
}

/** This function queries the database for an existing shopping list collection.
 * It does this by checking the `empty` property of the query results (`querySnapshot`).
 * The function returns false if `querySnapshot` is empty,
 * otherwise it returns true.
 */
export async function listExists(listId) {
	// Create a reference to the shopping list collection
	const listCollectionRef = collection(db, listId);

	// Create a query against the shopping list collection
	const q = query(listCollectionRef);

	// Using getDocs() function to retrive query results
	const querySnapshot = await getDocs(q);

	// Returns false (collection is non-existent) or true (collection exists)
	return querySnapshot.empty ? false : true;
}
