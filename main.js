const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interaction
const readline = require('readline'); // Importing readline for user input
const User = require('./Models/User'); // Importing User model
const Material = require('./Models/Material'); // Importing Material model
const Tool = require('./Models/Tool'); // Importing Tool model
const Item = require('./Models/Item'); // Importing Item model
const {
    addItem,
    findItemByName,
    updateItem,
    deleteItem,
    listAllItems,
    calculateWorth,
    addNewArrival,
} = require('./itemFunctions'); // Importing item-related functions
const {
    addTool,
    findToolByName,
    updateTool,
    deleteTool,
    listAllTools,
    useTool,
    fixTool,
} = require('./toolFunctions'); // Importing tool-related functions
const {
    addMaterial,
    findMaterialByName,
    updateMaterial,
    deleteMaterial,
    listAllMaterials,
    useMaterial,
} = require('./materialFunctions'); // Importing material-related functions
const {
    addUser,
    findUserByName,
    updateUser,
    deleteUser,
    listAllUsers,
    useItem,
    getUsedItems,
    buildSmth,
} = require('./userFunctions'); // Importing user functions

// Connect to MongoDB
mongoose.connect('mongodb+srv://AnnaEnkin:12345@cluster.kgo3b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster')
    .then(() => {
        console.log('Connected to MongoDB'); // Log success message
        mainMenu(); // Call main menu after successful connection
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err); // Log connection error
        process.exit(1); // Exit the program on connection error
    });

const rl = readline.createInterface({
    input: process.stdin, // Input from the standard input (terminal)
    output: process.stdout // Output to the standard output (terminal)
});

// Function to prompt user input
async function promptUser(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer); // Resolve the promise with user input
        });
    });
}

// Main menu function
async function mainMenu() {
    while (true) {
        // Display main menu options
        console.log('\nMain Menu');
        console.log('1. User Actions');
        console.log('2. Item Actions');
        console.log('3. Material Actions');
        console.log('4. Tool Actions');
        console.log('5. Exit');

        const choice = await promptUser('Choose an option: '); // Get user choice

        switch (choice) {
            case '1':
                await userMenu(); // Call user menu
                break;
            case '2':
                await itemMenu(); // Call item menu
                break;
            case '3':
                await materialMenu(); // Call material menu
                break;
            case '4':
                await toolMenu(); // Call tool menu
                break;
            case '5':
                rl.close(); // Close readline interface
                mongoose.connection.close(); // Close MongoDB connection
                process.exit(0); // Exit the program
                break;
            default:
                console.log('Invalid option, please try again.'); // Handle invalid option
        }
    }
}

// User menu function
async function userMenu() {
    while (true) {
        // Display user actions menu
        console.log('\nUser Actions');
        console.log('1. Create User');
        console.log('2. Find User');
        console.log('3. Update User');
        console.log('4. Delete User');
        console.log('5. List All Users');
        console.log('6. Use Item');
        console.log('7. Show Used Items');
        console.log('8. Build Something');
        console.log('0. Back to Main Menu');

        const choice = await promptUser('Choose an option: '); // Get user choice

        switch (choice) {
            case '1':
                // Create a new user
                const name = await promptUser('Enter user name: ');
                const age = await promptUser('Enter user age: ');
                await addUser(name, age); // Call addUser function
                break;
            case '2':
                // Find an existing user
                const userName = await promptUser('Enter user name to find: ');
                try {
                    const user = await findUserByName(userName); // Call findUserByName function
                    console.log('User found:', user); // Display found user
                } catch (error) {
                    console.log(error.message); // Handle errors
                }
                break;
            case '3':
                // Update user details
                const updateName = await promptUser('Enter user name to update: ');
                const updatedFields = {}; // Object to hold updated fields
                const newAge = await promptUser('Enter new age (leave blank to skip): ');
                if (newAge) updatedFields.age = newAge; // Update age if provided

                try {
                    await updateUser(updateName, updatedFields); // Call updateUser function
                } catch (error) {
                    console.log(error.message); // Handle errors
                }
                break;
            case '4':
                // Delete a user
                const deleteName = await promptUser('Enter user name to delete: ');
                try {
                    await deleteUser(deleteName); // Call deleteUser function
                } catch (error) {
                    console.log(error.message); // Handle errors
                }
                break;
            case '5':
                await listAllUsers(); // Call listAllUsers function
                break;
            case '6':
                // Use an item
                const userToUseItem = await promptUser('Enter user name: ');
                const itemToUse = await promptUser('Enter item name: ');
                const quantityToUse = await promptUser('Enter quantity to use: ');
                try {
                    await useItem(userToUseItem, itemToUse, parseInt(quantityToUse)); // Call useItem function
                } catch (error) {
                    console.log(error.message); // Handle errors
                }
                break;              
            case '7':
                // Show used items for a user
                const userForUsedItems = await promptUser('Enter user name: ');
                try {
                    await getUsedItems(userForUsedItems); // Call getUsedItems function
                } catch (error) {
                    console.log(error.message); // Handle errors
                }
                break;
            case '8':
                // Build something using items
                const userToBuild = await promptUser('Enter user name: ');        
                const inputed = await promptUser('Enter items and amounts (format: name1,amount1,name2,amount2,...): ');
                const inputArr = await inputed.split(','); // Split input into array
                const itemsNames = [];
                const itemsAmounts = [];

                // Process input array to separate names and amounts
                for (let i = 0; i < inputArr.length; i += 2) {
                    const name = inputArr[i].trim();
                    const amount = parseInt(inputArr[i + 1].trim(), 10);

                    if (isNaN(amount)) {
                        console.log(`Invalid amount for item: ${name}`); // Handle invalid amount
                        rl.close();
                        return;
                    }

                    itemsNames.push(name); // Add item name to names array
                    itemsAmounts.push(amount); // Add item amount to amounts array
                }

                try {
                    await buildSmth(userToBuild, itemsNames, itemsAmounts); // Call buildSmth function
                } catch (error) {
                    console.log(error.message); // Handle errors
                }
                break;   
            case '0':
                return; // Return to main menu
            default:
                console.log('Invalid option, please try again.'); // Handle invalid option
        }; 
    };
} 

// Item menu function
async function itemMenu() {
    while (true) {
        // Display item actions menu
        console.log('\nItem Actions');
        console.log('1. Add Item');
        console.log('2. List All Items');
        console.log('3. Add Amount');
        console.log('4. Show Item Worth');
        console.log('5. Delete Item');
        console.log('6. Find Item');
        console.log('7. Update Item');
        console.log('0. Back to Main Menu');

        const choice = await promptUser('Choose an option: '); // Get user choice

        switch (choice) {
            case '1':
                // Add a new item
                const name = await promptUser('Enter item name: ');
                const amount = await promptUser('Enter item amount: ');
                const cost = await promptUser('Enter item cost: ');
                await addItem(name, amount, cost); // Call addItem function
                break;
            case '2':
                await listAllItems(); // Call listAllItems function
                break;
            case '3':
                // Add amount to existing item
                const addName = await promptUser('Enter item name to add amount: ');
                const addAmount = await promptUser('Enter amount to add: ');
                await addNewArrival(addName, parseInt(addAmount)); // Call addNewArrival function
                break;
            case '4':
                // Show worth of an item
                const worthName = await promptUser('Enter item name to show worth: ');
                const worth = await calculateWorth(worthName); // Call calculateWorth function
                console.log(`Worth of ${worthName}:`, worth); // Display item worth
                break;
            case '5':
                // Delete an item
                const deleteName = await promptUser('Enter item name to delete: ');
                await deleteItem(deleteName); // Call deleteItem function
                break;
            case '6':
                // Find an item
                const findName = await promptUser('Enter item name to find: ');
                const foundItem = await findItemByName(findName); // Call findItemByName function
                console.log('Found item:', foundItem); // Display found item
                break;
            case '7':
                // Update item details
                const updateName = await promptUser('Enter item name to update: ');
                const updatedFields = {}; // Object to hold updated fields
                const newCost = await promptUser('Enter new cost (leave blank to skip): ');
                if (newCost) updatedFields.cost = newCost; // Update cost if provided
                const newAmount = await promptUser('Enter new amount (leave blank to skip): ');
                if (newAmount) updatedFields.amount = newAmount; // Update amount if provided

                try {
                    await updateItem(updateName, updatedFields); // Call updateItem function
                } catch (error) {
                    console.log(error.message); // Handle errors
                }
                break;
            case '0':
                return; // Return to main menu
            default:
                console.log('Invalid option, please try again.'); // Handle invalid option
        }
    }
}

// Material menu function
async function materialMenu() {
    while (true) {
        // Display material actions menu
        console.log('\nMaterial Actions');
        console.log('1. Add Material');
        console.log('2. List All Materials');
        console.log('3. Use Material');
        console.log('4. Update Material');
        console.log('5. Delete Material');
        console.log('6. Find Material');
        console.log('0. Back to Main Menu');

        const choice = await promptUser('Choose an option: '); // Get user choice

        switch (choice) {
            case '1':
                // Add a new material
                const materialName = await promptUser('Enter material name: ');
                const materialAmount = await promptUser('Enter material amount: ');
                const materialCost = await promptUser('Enter material cost: ');
                const supplier = await promptUser('Enter supplier name: ');
                const quality = await promptUser('Enter quality rating: ');
                await addMaterial(materialName, materialAmount, materialCost, supplier, quality); // Call addMaterial function
                break;
            case '2':
                await listAllMaterials(); // Call listAllMaterials function
                break;
            case '3':
                // Use a material
                const useMaterialName = await promptUser('Enter material name to use: ');
                const useQuantity = await promptUser('Enter quantity to use: ');
                await useMaterial(useMaterialName, parseInt(useQuantity)); // Call useMaterial function
                break;
            case '4':
                // Update material details
                const updateMaterialName = await promptUser('Enter material name to update: ');
                const updatedMaterialFields = {}; // Object to hold updated fields
                const newMaterialCost = await promptUser('Enter new cost (leave blank to skip): ');
                if (newMaterialCost) updatedMaterialFields.cost = newMaterialCost; // Update cost if provided
                const newMaterialAmount = await promptUser('Enter new amount (leave blank to skip): ');
                if (newMaterialAmount) updatedMaterialFields.amount = newMaterialAmount; // Update amount if provided

                try {
                    await updateMaterial(updateMaterialName, updatedMaterialFields); // Call updateMaterial function
                } catch (error) {
                    console.log(error.message); // Handle errors
                }
                break;
            case '5':
                // Delete a material
                const deleteMaterialName = await promptUser('Enter material name to delete: ');
                await deleteMaterial(deleteMaterialName); // Call deleteMaterial function
                break;
            case '6':
                // Find a material
                const findMaterialName = await promptUser('Enter material name to find: ');
                const foundMaterial = await findMaterialByName(findMaterialName); // Call findMaterialByName function
                console.log('Found material:', foundMaterial); // Display found material
                break;
            case '0':
                return; // Return to main menu
            default:
                console.log('Invalid option, please try again.'); // Handle invalid option
        }
    }
}

// Tool menu function
async function toolMenu() {
    while (true) {
        // Display tool actions menu
        console.log('\nTool Actions');
        console.log('1. Add Tool');
        console.log('2. List All Tools');
        console.log('3. Use Tool');
        console.log('4. Repair Tool');
        console.log('5. Update Tool');
        console.log('6. Delete Tool');
        console.log('7. Find Tool');
        console.log('0. Back to Main Menu');

        const choice = await promptUser('Choose an option: '); // Get user choice

        switch (choice) {
            case '1':
                // Add a new tool
                const toolName = await promptUser('Enter tool name: ');
                const toolUsage = await promptUser('Enter tool usage: ');
                const toolCondition = await promptUser('Enter tool condition (1-100): ');
                await addTool(toolName, toolUsage, toolCondition); // Call addTool function
                break;
            case '2':
                await listAllTools(); // Call listAllTools function
                break;
            case '3':
                // Use a tool
                const useToolName = await promptUser('Enter tool name to use: ');
                const userNameUsingTool = await promptUser('Enter user name: ');
                await useTool(useToolName, userNameUsingTool); // Call useTool function
                break;
            case '4':
                // Repair a tool
                const repairToolName = await promptUser('Enter tool name to repair: ');
                await fixTool(repairToolName); // Call fixTool function
                break;
            case '5':
                // Update tool details
                const updateToolName = await promptUser('Enter tool name to update: ');
                const updatedToolFields = {}; // Object to hold updated fields
                const newToolUsage = await promptUser('Enter new usage (leave blank to skip): ');
                if (newToolUsage) updatedToolFields.usage = newToolUsage; // Update usage if provided
                const newToolCondition = await promptUser('Enter new condition (leave blank to skip): ');
                if (newToolCondition) updatedToolFields.condition = newToolCondition; // Update condition if provided

                try {
                    await updateTool(updateToolName, updatedToolFields); // Call updateTool function
                } catch (error) {
                    console.log(error.message); // Handle errors
                }
                break;
            case '6':
                // Delete a tool
                const deleteToolName = await promptUser('Enter tool name to delete: ');
                await deleteTool(deleteToolName); // Call deleteTool function
                break;
            case '7':
                // Find a tool
                const findToolName = await promptUser('Enter tool name to find: ');
                const foundTool = await findToolByName(findToolName); // Call findToolByName function
                console.log('Found tool:', foundTool); // Display found tool
                break;
            case '0':
                return; // Return to main menu
            default:
                console.log('Invalid option, please try again.'); // Handle invalid option
        }
    }
}
