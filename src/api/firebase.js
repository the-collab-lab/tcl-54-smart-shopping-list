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
import { getFutureDate, getDaysBetweenDates } from '../utils/dates';

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

	// Retrieving values stored in firebase
	let totalPurchases = listItemSnap.data().totalPurchases;
	let dateLastPurchased = listItemSnap.data().dateLastPurchased;
	let dateCreated = listItemSnap.data().dateCreated;
	let dateNextPurchased = listItemSnap.data().dateNextPurchased;

	// Function estimating previous purchase interval
	// Because our lists have updated dateLastPurchased without updated dateNextPurchased,
	// the time intervals won't be accurate, so we recommend using only:
	const temporaryPreviousEstimate = getDaysBetweenDates(
		dateNextPurchased,
		dateCreated,
	);

	// *** ONCE DATABASE IS CLEANED UP ***
	// But longer term, if we hadn't been updating dateLastPurchased, this should be the long term logic:
	// const previousEstimate = dateLastPurchased
	// ? getDaysBetweeenDates(dateNextPurchased, dateLastPurchased)
	// : getDaysBetweenDates(dateNextPurchased, dateCreated)

	// This declares the number of days since the last transaction based on dateLastPurchased being a null or existing value
	const numDaysSinceLastTransaction = dateLastPurchased
		? // If dateLastPurchased returns TRUE, we get number of days between *dateLastPurchased* and current date
		  getDaysBetweenDates(new Date(), dateLastPurchased.toDate())
		: // If dateLastPurchased returns FALSE, we get number of days between *dateCreated* and current date
		  getDaysBetweenDates(new Date(), dateCreated.toDate());

	// Declaring variables for number of days until the NEXT purchase and converting to milliseconds
	const numDaysUntilNextPurchase = calculateEstimate(
		temporaryPreviousEstimate,
		numDaysSinceLastTransaction,
		totalPurchases,
	);
	const millisecondsUntilNextPurchase =
		numDaysUntilNextPurchase * (24 * 60 * 60 * 1000);
	// This is the nextPurchaseDate adding the the current date with the estimated next purchase date
	const nextPurchaseDate = new Date(
		new Date().getTime() + millisecondsUntilNextPurchase,
	);

	// This function sends updated values to Firestore
	await updateDoc(listItemRef, {
		// Updates dateLastPurchased to the time when the user checks off an item
		dateLastPurchased: new Date(),

		// This is calucated using calculateEstimate and added to the current date,
		// updating the next purchase date of an item
		dateNextPurchased: nextPurchaseDate,

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
