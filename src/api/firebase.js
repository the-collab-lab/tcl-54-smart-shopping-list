import {
	collection,
	onSnapshot,
	addDoc,
	getDocs,
	query,
	doc,
	updateDoc,
	increment,
	getDoc,
} from 'firebase/firestore';
import { db } from './config';
import { getFutureDate } from '../utils';

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
		// console.log('data.id:', data.id);
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
 */
export async function updateItem(listId, itemId, checked) {
	const listItemRef = doc(db, listId, itemId);
	const listItemSnap = await getDoc(listItemRef);

	const currentTotalPurchases = listItemSnap.data().totalPurchases;
	let totalPurchases = currentTotalPurchases;

	// the idea here is to store the old value of the `dateLastPurchased` property
	// to a temporary variable called `originalDateLastPurchased`.
	// We want this value so that we can revert back to it if the user un-checks an item.
	let originalDateLastPurchased = listItemSnap
		.data()
		.dateLastPurchased.toDate();

	console.log(originalDateLastPurchased);
	// console output: a string date
	// Fri Feb 03 2023 03:16:50 GMT-0800 (Pacific Standard Time)

	// this is default setting `dateLastPurchased` as the old value (see line 93)
	let dateLastPurchased = originalDateLastPurchased;

	// if `checked` is true, `dateLastPurchased` is set to a new date.
	// total purchases is also incremented.
	if (checked === true) {
		dateLastPurchased = new Date();
		totalPurchases = currentTotalPurchases + 1;
	} else {
		totalPurchases = currentTotalPurchases - 1;
		// we decrement total purchases
		// we don't need to update `dateLastPurchased` in here, since default is already declared on line 102
	}

	// updateDoc updates the document's respective properties
	await updateDoc(listItemRef, {
		dateLastPurchased,
		totalPurchases,
	});

	/** Note to mentors & collabies!
	 *
	 * This entire function currently only updates `totalPurchases`.
	 * `dateLastPurchased` doesn't revert back to the original date when un-checked like we want to.
	 *
	 * The issue seems to arise from `listItemSnap` (line 85),
	 * which only gets the most updated value of `dateLastPurchased`.
	 * Therefore, the use of `originalDateLastPurchased` on line 93 doesn't work. It's always going to
	 * have the updated date, not the old date.
	 *
	 * also, you don't see it here, but we also tried to experiment with date-fns, a dates JS library (this is a great library, btw!)
	 * The issue still comes back to the list snapshot, though.
	 */
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
