const mongoose = require('mongoose');
const Item = require('./Item');

// Tool Schema
// Extends the Item schema to include usage, condition, and borrowedBy attributes
const toolSchema = new mongoose.Schema({
    usage: { type: Number, required: true, min: 0, max: 100 }, // The usage level of the tool (0-100)
    condition: { type: Number, required: true, min: 0, max: 100 }, // Condition of the tool (0-100)
    borrowedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users who borrowed this tool
});

// Tool Methods
// Method to use the tool, reduces condition by 10 if above 15, and adds the user to the borrowedBy list
toolSchema.methods.useTool = async function(userName) {
    const user = await mongoose.model('User').findOne({ name: userName });

    if (!user) {
        throw new Error('User not found.');
    }

    if (this.condition > 15) {
        this.condition -= 10; // Reduce tool's condition by 10
        this.borrowedBy.push(user._id); // Add the user's ID to the borrowedBy list

        // Add tool to the user's used items list if not already present
        if (!user.usedItems.includes(this.name)) {
            user.usedItems.push(this.name);
        }

        await this.save(); // Save the tool with updated condition
        await user.save(); // Save the user with updated used items
        return `Tool ${this.name} used by ${user.name};`;
    } else {
        throw new Error('This tool cannot be used due to its condition.');
    }
};

// Method to fix the tool, increases condition by 20 but does not exceed 100
toolSchema.methods.fixTool = async function() {
    this.condition = Math.min(this.condition + 20, 100); // Add 20 to condition, capped at 100
    await this.save(); // Save the updated tool condition
};

// Tool Model
// Creates the Tool model by inheriting from the Item schema
const Tool = Item.discriminator('Tool', toolSchema);

module.exports = Tool;
