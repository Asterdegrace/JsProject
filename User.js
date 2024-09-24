const mongoose = require('mongoose');

// User Schema
// Defines the schema for the "User" model with name, age, and usedItems attributes
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the user, required
    age: { type: Number, required: true, min: 0 }, // Age of the user, must be non-negative
    usedItems: [{ type: String }] // List of items used by the user (item names)
});

// User Methods
// Method to use an item, reducing its amount and adding the user's name to the item's usedBy list
userSchema.methods.useItem = async function(itemName, number) {
    const item = await mongoose.model('Item').findOne({ name: itemName });

    if (!item) {
        throw new Error('Item not found.');
    } else if (number > item.amount) {
        throw new Error(`There is less ${item.name} than that.`);
    }

    item.amount -= number;
    await item.save();

    if (!item.usedBy) {
        item.usedBy = [];
    }
    item.usedBy.push(this.name); // Add the user's name to the item's usedBy list
    await item.save();

    return `User ${this.name} used ${number} of ${item.name}.`;
};

// Method to get the list of items used by the user
userSchema.methods.getUsedItems = async function() {
    // Returns the array of item names used by this user
    return this.usedItems;
};

// Method to build something using specific tools and materials
userSchema.methods.buildSomething = async function(itemsNames, itemsAmounts) {
    if (itemsNames.length !== itemsAmounts.length) {
        throw new Error('The number of item names and amounts must match.');
    }

    const toolsUsed = [];
    const materialsUsed = [];

    // Loop through the provided items and update their amounts or conditions accordingly
    for (let i = 0; i < itemsNames.length; i++) {
        const itemName = itemsNames[i];
        const itemAmount = itemsAmounts[i];

        const item = await mongoose.model('Item').findOne({ name: itemName });

        if (!item) {
            throw new Error(`Item ${itemName} not found in the database.`);
        }

        if (itemAmount > item.amount) {
            throw new Error(`Not enough of ${itemName} available.`);
        }

        // Check if the item is a tool and handle it accordingly
        if (item.itemType === 'Tool') {
            const tool = await mongoose.model('Tool').findOne({ name: itemName });
            await tool.useTool(this.name); // Use the tool and reduce its condition
            
            // Add user to borrowedBy array if not already present
            if (!tool.borrowedBy.includes(this._id)) {
                tool.borrowedBy.push(this._id);
            }
            
            await tool.save();
            
            toolsUsed.push(tool.name);
        } else {
            // If it's a material, reduce its amount and save
            item.amount -= itemAmount;
            await item.save();
            materialsUsed.push({ name: item.name, amount: itemAmount });
        }
    }

    console.log(`${this.name} built something using tools:`, toolsUsed, 'and materials:', materialsUsed);
};

// User Model
// Creates the User model using the userSchema
const User = mongoose.model('User', userSchema);

module.exports = User;
