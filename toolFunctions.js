const mongoose = require('mongoose');
const Tool = require('./Models/Tool');

// Create a new tool
// This function adds a new tool to the database with the specified properties
async function addTool(name, amount, cost, usage, condition) {
    // Validate tool name
    if (typeof name !== 'string' || name.trim() === '') {
        throw new Error('Invalid tool name: name must be a non-empty string.');
    }

    // Validate numeric inputs
    if (!Number.isInteger(amount) || amount < 0) {
        throw new Error('Invalid amount: must be a non-negative integer.');
    }
    if (typeof cost !== 'number' || cost < 0) {
        throw new Error('Invalid cost: must be a non-negative number.');
    }
    if (typeof usage !== 'number' || usage < 0 || usage > 100) {
        throw new Error('Invalid usage: must be a number between 0 and 100.');
    }
    if (typeof condition !== 'number' || condition < 0 || condition > 100) {
        throw new Error('Invalid condition: must be a number between 0 and 100.');
    }

    const tool = new Tool({ name, amount, cost, usage, condition });
    await tool.save();
    console.log('Tool added:', tool); // Log the added tool
}

// Find a tool by name
// This function retrieves a tool from the database using its name
async function findToolByName(toolName) {
    const tool = await Tool.findOne({ name: toolName });

    if (!tool) {
        throw new Error('Tool not found.'); // Error if not found
    }

    return tool; // Return the found tool
}

// Update a tool by name
// This function updates the specified fields of a tool found by its name
async function updateTool(toolName, updatedFields) {
    const tool = await findToolByName(toolName);

    Object.assign(tool, updatedFields); // Merge updated fields into the tool
    await tool.save();

    console.log('Tool updated:', tool); // Log the updated tool
}

// Delete a tool by name
// This function deletes a tool from the database using its name
async function deleteTool(toolName) {
    const result = await Tool.deleteOne({ name: toolName });

    if (result.deletedCount === 0) {
        throw new Error('No tool found with that name.'); // Error if not found
    }

    console.log('Tool deleted:', toolName); // Log the deleted tool name
}

// List all tools
// This function retrieves and lists all tools in the database
async function listAllTools() {
    const tools = await Tool.find({});
    console.log('All tools:', tools); // Log all tools
}

// Use a tool
// This function uses a specified tool by calling its useTool method and logs the action
async function useTool(toolName, userName) {
    const tool = await findToolByName(toolName);
    await tool.useTool(userName); // Call the useTool method with userName
    await tool.save();
    console.log('Tool used:', tool); // Log the updated tool
}

// Fix a tool
// This function repairs a specified tool by calling its fixTool method and logs the action
async function fixTool(toolName) {
    const tool = await findToolByName(toolName);
    await tool.fixTool(); // Call the fixTool method
    await tool.save();
    console.log('Tool fixed:', tool); // Log the updated tool
}

// Exporting the functions for use in other modules
module.exports = {
    addTool,
    findToolByName,
    updateTool,
    deleteTool,
    listAllTools,
    useTool,
    fixTool,
};
