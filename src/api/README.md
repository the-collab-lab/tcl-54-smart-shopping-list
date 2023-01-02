# The shopping list API

## Overview

The `firebase.js` file contains all of the functions that communicate with your Firestore database. Think of it as the home base for the shopping list API. React components that need to communicate with your Firestore database should import a function defined here; they should _never_ import any modules in the `firebase/firestore` package directly.

## The API functions

### `addItem`

This function takes user-provided data and uses it to create a new item in the Firestore database.

| Parameter                        | Type     | Description                                                                  |
| -------------------------------- | -------- | ---------------------------------------------------------------------------- |
| `listId`                         | `string` | The list to which this item will be added.                                   |
| `itemData.daysUntilNextPurchase` | `number` | The number of days until the user thinks they'll need to buy the item again. |
| `itemData.name`                  | `string` | The name of the item.                                                        |

#### Note

**`daysUntilNextPurchase` is not added to the item directly**. It is used alomngside the `getFutureDate` utility function to create a new _JavaScript Date_ that represents when we think the user will buy the item again.

### `updateItem`

🚧 To be completed! 🚧

### `deleteItem`

🚧 To be completed! 🚧

## The shape of the the data

When we request a shopping list, it is sent to us as an array of objects with a specific shape – a specific arrangeement of properties and the kinds of data those properties can hold. This table describes the shape of the items that go into the shopping list.

| Property            | Type      | Description                                                       |
| ------------------- | --------- | ----------------------------------------------------------------- |
| `dateCreated`       | `Date`    | The date at which the item was created.                           |
| `dateLastPurchased` | `Date`    | The date at which the item was last purchased.                    |
| `dateNextPurchased` | `Date`    | The date at which we expect the user to purchase this item again. |
| `name`              | `string`  | The name of the item.                                             |
| `totalPurchases`    | `number`  | The total number of times the item has been purchased.            |
