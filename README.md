# Storage Application

## Overview
This project is a Storage Application built with Node.js and MongoDB. It allows users to manage items, tools, and materials, including CRUD operations and validations.

## Setup

1. **Clone the repository**:
   ```bash
   git clone (https://github.com/Asterdegrace/JsProject.git)
2. **Install dependencies**:
    npm install
3. **Make sure you have Mongo DB**:
4. **Run the Application**:
    node main.js

**MongoDB Database Structure**
The MongoDB database includes the following collections:

#Users: Contains user data with attributes like nickname and age.
#Items: Stores items with attributes like name, amount, cost, and inherited attributes from Tool and Material.
#Tools: Inherits from Items and includes additional attributes such as usage, borrowedBy, and condition.
#Materials: Inherits from Items and includes attributes like supplier and quality.

Features:
Classes and Methods
Base Class: Item

worth(): Returns the worth of the item (amount * cost).
newArrival(amount): Adds to the amount of the item.
Child Class: Tool

useTool(userName): Uses the tool, reducing its condition if above 15.
fixTool(): Increases the condition by 20.
Child Class: Material

use(amount): Removes a specified amount of the material.
useItem(itemName): Uses an item and records the user's name.
usedItems(): Returns a list of all tools used by that user.
buildSomething(data): Processes materials and tools needed to build an item.
User Class

materials, ensuring data integrity through validations and organized classes.

Project is built JsFinal(
    Models(
        Item.js
        Material.js
        Tool.js
        User.js
    )
    itemFunctions.js
    materialFunctions.js
    toolFunctions.js
    userFunctions.js

    main.js
    README.md(me >.<)
)


**Examples of Usage**
 {
    const user = new User("JohnDoe", "john@example.com", 30);//Creating a User
 }

 {
    const item = new Item("Hammer", 10, 5);
item.newArrival(5); //adding an Item
 }
