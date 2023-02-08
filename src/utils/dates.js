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
	/* Finding elapsed time by finding the absolute value of currentDate substracted from purchaseDate
	The result of timeElapsed will is in miliseconds */
	const timeElapsed = Math.abs(date1 - date2);

	/* daysElapsed converts the miliseconds of timeElapsed into days */
	const daysElapsed = timeElapsed / ONE_DAY_IN_MILLISECONDS;
	return daysElapsed;
}
