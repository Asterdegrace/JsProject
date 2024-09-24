const mongoose = require('mongoose');

// Item Schema
// Defines the schema for the "Item" model with name, amount, and cost attributes
// The discriminatorKey 'itemType' allows different types of items to use this schema
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the item, required
    amount: { type: Number, required: true, min: 0 }, // Quantity of the item, must be non-negative
    cost: { type: Number, required: true, min: 0 } // Cost of the item, must be non-negative
}, { discriminatorKey: 'itemType' });

// Item Methods
// Method to calculate the total worth of the item (amount * cost)
itemSchema.methods.worth = function() {
    return this.amount * this.cost;
};

// Method to add a new arrival of items, increasing the amount
// Throws an error if the provided amount is negative
itemSchema.methods.newArrival = function(amount) {
    if (amount < 0) {
        throw new Error('Amount must be non-negative.');
    }
    this.amount += amount;
};

// Item Model
// Defines the "Item" model using the itemSchema
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
