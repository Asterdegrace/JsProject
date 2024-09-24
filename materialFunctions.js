const mongoose = require('mongoose');
const Material = require('./Models/Material');

// Create a new material
// This function adds a new material to the database with the specified properties
async function addMaterial(name, amount, cost, supplier, quality) {
    // Validate material name
    if (typeof name !== 'string' || name.trim() === '') {
        throw new Error('Invalid material name: name must be a non-empty string.');
    }
    
    // Validate numeric inputs
    if (!Number.isInteger(amount) || amount < 0) {
        throw new Error('Invalid amount: must be a non-negative integer.');
    }
    if (typeof cost !== 'number' || cost < 0) {
        throw new Error('Invalid cost: must be a non-negative number.');
    }

    const material = new Material({ name, amount, cost, supplier, quality });
    await material.save();
    console.log('Material added:', material); // Log the added material
}

// Find a material by name
// This function retrieves a material from the database using its name
async function findMaterialByName(materialName) {
    const material = await Material.findOne({ name: materialName });

    if (!material) {
        throw new Error('Material not found.'); // Error if not found
    }

    return material; // Return the found material
}

// Update a material by name
// This function updates the specified fields of a material found by its name
async function updateMaterial(materialName, updatedFields) {
    const material = await findMaterialByName(materialName);

    Object.assign(material, updatedFields); // Merge updated fields into the material
    await material.save();

    console.log('Material updated:', material); // Log the updated material
}

// Delete a material by name
// This function deletes a material from the database using its name
async function deleteMaterial(materialName) {
    const result = await Material.deleteOne({ name: materialName });

    if (result.deletedCount === 0) {
        throw new Error('No material found with that name.'); // Error if not found
    }

    console.log('Material deleted:', materialName); // Log the deleted material name
}

// List all materials
// This function retrieves and lists all materials in the database
async function listAllMaterials() {
    const materials = await Material.find({});
    console.log('All materials:', materials); // Log all materials
}

// Use material
// This function uses a specified amount of a material by calling its use method
async function useMaterial(materialName, amount) {
    const material = await findMaterialByName(materialName);
    await material.use(amount); // Call the use method
    await material.save();
    console.log('Material used:', material); // Log the updated material
}

// Exporting the functions for use in other modules
module.exports = {
    addMaterial,
    findMaterialByName,
    updateMaterial,
    deleteMaterial,
    listAllMaterials,
    useMaterial,
};


/*
async function calculateWorth(itemName) {
    const material = await findItemByName(itemName);
    return material.worth();
};
*/
