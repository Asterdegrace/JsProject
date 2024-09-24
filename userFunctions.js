const mongoose = require('mongoose');
const User = require('./Models/User');
const Tool = require('./Models/Tool');
const Material = require('./Models/Material');

// Create a new user
// This function adds a new user to the database with the specified name, age, and email
async function addUser(name, age, email) {
    const user = new User({ name, age, email });
    try {
        await user.save();
        console.log('User added:', user); // Log the added user
    } catch (error) {
        console.error('Error adding user:', error.message); // Log error if any
    }
}

// Find a user by name
// This function retrieves a user from the database using their name
async function findUserByName(userName) {
    const user = await User.findOne({ name: userName });

    if (!user) {
        throw new Error('User not found.'); // Error if user not found
    }

    return user; // Return the found user
}

// Update a user by name
// This function updates the specified fields of a user found by their name
async function updateUser(userName, updatedFields) {
    const user = await findUserByName(userName);

    Object.assign(user, updatedFields); // Merge updated fields into the user
    await user.save();

    console.log('User updated:', user); // Log the updated user
}

// Delete a user by name
// This function deletes a user from the database using their name
async function deleteUser(userName) {
    const result = await User.deleteOne({ name: userName });

    if (result.deletedCount === 0) {
        throw new Error('No user found with that name.'); // Error if user not found
    }

    console.log('User deleted:', userName); // Log the deleted user name
}

// List all users
// This function retrieves and lists all users in the database
async function listAllUsers() {
    const users = await User.find({});
    console.log('All users:', users); // Log all users
}

// Use an item and add to user's used items list
// This function records the use of an item by a user
async function useItem(userName, itemName, number) {
    const user = await findUserByName(userName);
    await user.useItem(itemName, number); // Using the user's method to add used item
    await user.save(); // Save the user to persist changes
    console.log(`${user.name} used the item: ${itemName}`); // Log the action
}

// Get all tools used by a user
// This function retrieves and lists all tools that a user has used
async function getUsedItems(userName) {
    const user = await findUserByName(userName);
    const usedItems = await user.getUsedItems(); // Use the user's method to get used items
    console.log(`${user.name}'s used tools:`, usedItems); // Log the used items
}

// Build something using specified items
// This function triggers the build process for the current user
async function buildSmth(currUser, itemName, itemAmount) {
    let user = await User.findOne({ name: currUser });
    if (!user) {
        throw new Error('No user found with that name.'); // Error if user not found
    }
    user.buildSomething(itemName, itemAmount)
        .then(() => {
            console.log('Build process completed successfully.'); // Log successful build
        })
        .catch((err) => {
            console.log('Error:', err.message); // Log error if any during build
        });
}

// Exporting the functions for use in other modules
module.exports = {
    addUser,
    findUserByName,
    updateUser,
    deleteUser,
    listAllUsers,
    useItem,
    getUsedItems,
    buildSmth
};
