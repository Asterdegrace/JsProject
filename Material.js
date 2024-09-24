const mongoose = require('mongoose');
const Item = require('./Item');

// Material Schema
// Extends the Item schema to include supplier and quality attributes
const materialSchema = new mongoose.Schema({
    supplier: { type: String, required: true }, // Name of the material's supplier, required
    quality: { type: String, required: true }, // Quality rating of the material, required
});

// Material Methods
// Method to use a specified amount of material
// Throws an error if a negative amount is provided or if there is insufficient material
materialSchema.methods.use = async function(number) {
    if (number < 0) {
        throw new Error('Cannot use a negative amount of material.');
    }
    if (number > this.amount) {
        throw new Error(`Not enough ${this.name} available to use.`);
    }

    this.amount -= number; // Decrease the amount of material
    await this.save(); // Save the updated material to the database
};

// Material Model
// Creates the Material model using the Item schema as a base with additional fields
const Material = Item.discriminator('Material', materialSchema);

module.exports = Material;
