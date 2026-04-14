// Run this once to seed the database: node seed.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const dbName = 'pizzeria';

async function seed() {
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);

  await db.collection('pizzas').deleteMany({});
  await db.collection('pizzas').insertMany([
    { name: "Margherita", price: 299, description: "Classic tomato sauce, fresh mozzarella and basil", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop", type: "veg", rating: 4.5 },
    { name: "Pepperoni", price: 399, description: "Loaded with pepperoni slices on rich tomato sauce", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop", type: "nonveg", rating: 4.8 },
    { name: "BBQ Chicken", price: 449, description: "Grilled chicken with smoky BBQ sauce and red onions", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", type: "nonveg", rating: 4.7 },
    { name: "Veggie Supreme", price: 349, description: "Bell peppers, mushrooms, olives, onions on tomato base", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop", type: "veg", rating: 4.3 },
    { name: "Paneer Tikka", price: 379, description: "Spiced paneer with tikka masala sauce and onions", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop", type: "veg", rating: 4.6 },
    { name: "Chicken Tikka", price: 429, description: "Tandoor-marinated chicken with mint chutney base", image: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=400&h=300&fit=crop", type: "nonveg", rating: 4.9 },
    { name: "Four Cheese", price: 499, description: "Mozzarella, cheddar, gouda and parmesan blend", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop", type: "veg", rating: 4.4 },
    { name: "Mushroom Delight", price: 329, description: "Assorted mushrooms with garlic butter and thyme", image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop", type: "veg", rating: 4.2 },
    { name: "Spicy Sausage", price: 459, description: "Hot Italian sausage with chili flakes and roasted peppers", image: "https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=400&h=300&fit=crop", type: "nonveg", rating: 4.6 },
    { name: "Hawaiian", price: 389, description: "Ham and pineapple on a sweet tomato base", image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop", type: "nonveg", rating: 4.1 },
    { name: "Pesto Veggie", price: 369, description: "Basil pesto base with zucchini, sun-dried tomatoes and feta", image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop", type: "veg", rating: 4.4 },
    { name: "Meat Feast", price: 529, description: "Pepperoni, sausage, chicken and bacon loaded on rich tomato sauce", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=300&fit=crop", type: "nonveg", rating: 4.9 },
    { name: "Spinach & Feta", price: 359, description: "Fresh spinach, feta cheese and garlic on olive oil base", image: "https://images.unsplash.com/photo-1548369937-47519962c11a?w=400&h=300&fit=crop", type: "veg", rating: 4.3 },
    { name: "Prawn Delight", price: 549, description: "Juicy prawns with garlic butter, lemon zest and parsley", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", type: "nonveg", rating: 4.7 },
    { name: "Corn & Capsicum", price: 319, description: "Sweet corn and colorful capsicum on creamy white sauce", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop", type: "veg", rating: 4.0 },
    { name: "Truffle Mushroom", price: 579, description: "Wild mushrooms with truffle oil, parmesan and fresh thyme", image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop", type: "veg", rating: 4.8 },
    { name: "Buffalo Chicken", price: 469, description: "Spicy buffalo-glazed chicken with blue cheese drizzle", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", type: "nonveg", rating: 4.7 },
    { name: "Roasted Garlic & Spinach", price: 339, description: "Roasted garlic, baby spinach and ricotta on olive oil base", image: "https://images.unsplash.com/photo-1548369937-47519962c11a?w=400&h=300&fit=crop", type: "veg", rating: 4.3 },
    { name: "Tuna Melt", price: 489, description: "Flaked tuna, capers, red onion and melted mozzarella", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop", type: "nonveg", rating: 4.4 },
    { name: "Double Pepperoni", price: 449, description: "Double layer of pepperoni with extra cheese and oregano", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop", type: "nonveg", rating: 4.9 },
    { name: "Caprese", price: 349, description: "Fresh tomatoes, buffalo mozzarella, basil and balsamic glaze", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop", type: "veg", rating: 4.5 },
    { name: "Lamb & Mint", price: 559, description: "Spiced minced lamb with fresh mint and red onion", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=300&fit=crop", type: "nonveg", rating: 4.6 },
    { name: "Avocado & Corn", price: 379, description: "Creamy avocado, sweet corn and cherry tomatoes on pesto base", image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop", type: "veg", rating: 4.2 },
    { name: "Keema Pizza", price: 479, description: "Spiced minced chicken keema with onions and green chillies", image: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=400&h=300&fit=crop", type: "nonveg", rating: 4.7 }
  ]);

  await db.collection('ingredients').deleteMany({});
  await db.collection('ingredients').insertMany([
    { tname: "Extra Cheese", price: 50, image: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=200&h=200&fit=crop" },
    { tname: "Mushrooms", price: 40, image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200&h=200&fit=crop" },
    { tname: "Bell Peppers", price: 35, image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=200&h=200&fit=crop" },
    { tname: "Olives", price: 45, image: "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=200&h=200&fit=crop" },
    { tname: "Onions", price: 25, image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&h=200&fit=crop" },
    { tname: "Tomatoes", price: 30, image: "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=200&h=200&fit=crop" },
    { tname: "Chicken", price: 80, image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200&h=200&fit=crop" },
    { tname: "Paneer", price: 70, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&h=200&fit=crop" },
    { tname: "Corn", price: 30, image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=200&h=200&fit=crop" },
    { tname: "Jalapenos", price: 40, image: "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=200&h=200&fit=crop" },
    { tname: "Bacon", price: 90, image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=200&h=200&fit=crop" },
    { tname: "Pineapple", price: 35, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200&h=200&fit=crop" },
    { tname: "Spinach", price: 30, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop" },
    { tname: "Sun-dried Tomatoes", price: 50, image: "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=200&h=200&fit=crop" },
    { tname: "Prawns", price: 110, image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200&h=200&fit=crop" },
    { tname: "Feta Cheese", price: 60, image: "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=200&h=200&fit=crop" },
    { tname: "Garlic", price: 20, image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=200&h=200&fit=crop" },
    { tname: "Avocado", price: 65, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&h=200&fit=crop" },
    { tname: "Red Chilli", price: 20, image: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=200&h=200&fit=crop" },
    { tname: "Ricotta", price: 75, image: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?w=200&h=200&fit=crop" },
    { tname: "Capers", price: 45, image: "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=200&h=200&fit=crop" },
    { tname: "Tuna", price: 100, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop" },
    { tname: "Lamb", price: 120, image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=200&h=200&fit=crop" },
    { tname: "Basil", price: 25, image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=200&h=200&fit=crop" }
  ]);

  console.log('Database seeded successfully!');
  await client.close();
}

seed().catch(console.error);
