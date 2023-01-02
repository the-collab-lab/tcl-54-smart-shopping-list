import { useState, useEffect } from 'react';

/**
 * Set some state in React, and also persist that value in localStorage.
 * @param {string} initialValue The initial value to store in localStorage and React state.
 * @param {string} storageKey The key of the value in localStorage.
 */
export function useStateWithStorage(initialValue, storageKey) {
	const [value, setValue] = useState(() => {
		const currentValue = localStorage.getItem(storageKey);
		return currentValue ? currentValue : initialValue;
	});
	useEffect(() => {
		if (value === null || value === undefined) {
			return localStorage.removeItem(storageKey);
		}
		return localStorage.setItem(storageKey, value);
	}, [storageKey, value]);
	return [value, setValue];
}
