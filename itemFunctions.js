const mongoose = require('mongoose');
const Item = require('./Models/Item');

// Create a new item
// This function adds a new item to the database with the specified name, amount, and cost
async function addItem(name, amount, cost) {
    const item = new Item({ name, amount, cost });
    await item.save();
    console.log('Item added:', item);
}

// Find an item by name
// This function searches for an item in the database using its name
async function findItemByName(itemName) {
    const item = await Item.findOne({ name: itemName });

    if (!item) {
        throw new Error('Item not found.');
    }

    return item; // Returns the found item
}

// Update an item by name
// This function updates the specified fields of an item found by its name
async function updateItem(itemName, updatedFields) {
    const item = await findItemByName(itemName);
    
    Object.assign(item, updatedFields); // Merge updated fields into the item
    await item.save();

    console.log('Item updated:', item); // Log the updated item
}

// Delete an item by name
// This function deletes an item from the database using its name
async function deleteItem(itemName) {
    const result = await Item.deleteOne({ name: itemName });

    if (result.deletedCount === 0) {
        throw new Error('No item found with that name.');
    }

    console.log('Item deleted:', itemName); // Log the deleted item name
}

// List all items
// This function retrieves and lists all items in the database
async function listAllItems() {
    const items = await Item.find({});
    console.log('All items:', items); // Log all items
}

// Calculate worth of an item
// This function calculates and returns the worth of an item by its name
async function calculateWorth(itemName) {
    const item = await findItemByName(itemName);
    return item.worth(); // Return the calculated worth
}

// Add new arrival to an item
// This function adds a specified amount to an item's quantity
async function addNewArrival(itemName, amountToAdd) {
    const item = await findItemByName(itemName);
    item.newArrival(amountToAdd); // Update the item's amount
    await item.save();
    console.log('New arrival added to item:', item); // Log the updated item
}

module.exports = {
    addItem,
    findItemByName,
    updateItem,
    deleteItem,
    listAllItems,
    calculateWorth,
    addNewArrival,
};
