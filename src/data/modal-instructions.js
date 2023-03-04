/* Onboarding instructions for the Learn More modal */

export const instructions = [
	{
		text: "1. To get started, create a new (empty) shopping list with a randomly generated name (token). Or you can join an existing list by entering its token. In your list, you'll be able to add new items.",
	},
	{
		text: "2. When adding a new item you'll choose how urgent you want to buy it (i.e., soon, kind of soon, not soon).",
	},
	{
		text: "3. When one or more items are added to your list, you'll be able to:",
		stepOne: 'Check off items on the list as you buy them',
		stepTwo:
			'See the items move into different groups of urgency based on how often you buy them',
		stepThree: 'Delete items from your list',
	},
	{
		noteOne: 'Purchased items remain checked for 24 hours.',
		noteTwo:
			'Items that have not been bought for over 60 days are labeled inactive.',
	},
];
