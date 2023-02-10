export const ONE_DAY_IN_MILLISECONDS = 86400000;

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

/** This function returns the number of days elapsed between two JavaScript Dates*/
export function getDaysBetweenDates(date1, date2) {
	/* The time elapsed between two dates is found by getting 
	the absolute value of their difference in milliseconds. */
	const timeElapsed = Math.abs(date1 - date2);

	/* daysElapsed converts the milliseconds of timeElapsed into days */
	const daysElapsed = timeElapsed / ONE_DAY_IN_MILLISECONDS;
	return daysElapsed;
}
