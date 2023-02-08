const ONE_DAY_IN_MILLISECONDS = 86400000;

/**
 * Get a new JavaScript Date that is `offset` days in the future.
 * @example
 * // Returns a Date 3 days in the future
 * getFutureDate(3)
 * @param {number} offset
 */
export function getFutureDate(offset) {
	return new Date(Date.now() + offset * ONE_DAY_IN_MILLISECONDS);
}

export function getDaysBetweenDates(date1, date2) {
	// console.log("date 1: " + date1);
	// console.log("date 2: " + date2);

	// console.log("date 1 to date: " + date1.toDate());
	// console.log("date 2 to date: " + date2.toDate());

	const numberDate1 = date1.getTime();
	const numberDate2 = date2.getTime();
	// console.log(date1);
	// console.log("toDate & getTime for date1: " + date1.toDate().getTime());
	console.log('getTime for date1: ' + numberDate1);

	// const timeElapsed = Math.abs(date1.toDate() - date2.toDate())

	// console.log("Time elapsed: " + timeElapsed)

	// return
}

// const currentDate = new Date();
// 		let purchasedDate = dateLastPurchased
// 			? dateLastPurchased.toDate()
// 			: dateLastPurchased;
// 		const timeElapsed = Math.abs(currentDate - purchasedDate);
// 		const hoursElapsed = timeElapsed / (1000 * 60 * 60);
// 		hoursElapsed < 24 ? setCheck(true) : setCheck(false);
