import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../server/.env') });

// Initialize Firebase Admin
initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  })
});

const db = getFirestore();

const menuData = [
  // 1. Pastries & Snacks
  { name: "Gozleme - Minced Beef", category: "Pastries & Snacks", price: 250, description: "Traditional Turkish flatbread stuffed with minced beef." },
  { name: "Gozleme - Potato / Cheese", category: "Pastries & Snacks", price: 250, description: "Traditional Turkish flatbread stuffed with potato and cheese." },
  { name: "Gozleme - Chicken & Mushroom", category: "Pastries & Snacks", price: 250, description: "Traditional Turkish flatbread stuffed with chicken and mushroom." },
  { name: "Gozleme - Spinach & Feta", category: "Pastries & Snacks", price: 250, description: "Traditional Turkish flatbread stuffed with spinach and feta cheese." },
  { name: "Cig Borek - Beef / Cheese", category: "Pastries & Snacks", price: 250, description: "Deep-fried turnover stuffed with your choice of beef or cheese." },
  { name: "Samosa - Minced Beef / Chicken / Feta & Coriander", category: "Pastries & Snacks", price: 100, description: "Crispy pastry filled with minced beef, chicken, or feta & coriander." },
  { name: "Pogaca - Potato / Minced Beef / Mozerella", category: "Pastries & Snacks", price: 100, description: "Soft Turkish bread rolls filled with potato, minced beef, or mozzarella." },
  { name: "Chapati", category: "Pastries & Snacks", price: 70, description: "Soft and flaky flatbread." },
  { name: "Lavash", category: "Pastries & Snacks", price: 70, description: "Thin and soft flatbread." },

  // 2. Breakfast
  { name: "Fried Eggs", category: "Breakfast", price: 150, description: "Simple and delicious fried eggs." },
  { name: "Scrambled Eggs", category: "Breakfast", price: 200, description: "Soft, fluffy scrambled eggs." },
  { name: "Omelette (Plain)", category: "Breakfast", price: 200, description: "Classic folded omelette." },
  { name: "Omelette (Cheese / Mushroom / Spanish)", category: "Breakfast", price: 250, description: "Omelette with choice of cheese, mushroom, or Spanish style." },
  { name: "Menemen", category: "Breakfast", price: 300, description: "Traditional Turkish scrambled eggs with tomatoes, green peppers, and onions." },
  { name: "Panini (Halloumi / Chicken & Mayo)", category: "Breakfast", price: 350, description: "Toasted panini with your choice of Halloumi cheese or Chicken & Mayo." },
  { name: "Sausages x 2 pieces", category: "Breakfast", price: 150, description: "Tasty breakfast sausages." },
  { name: "Falafel Wrap", category: "Breakfast", price: 250, description: "Crispy falafel wrapped in flatbread with fresh veggies." },
  { name: "English Breakfast", category: "Breakfast", price: 500, description: "Eggs, Sausage, Baked Beans, Mushrooms, Grilled Tomatoes & Toasted Bread." },

  // 3. Home Cooked Meals
  { name: "Soup of the Day", category: "Home Cooked Meals", price: 200, description: "Fresh daily soup." },
  { name: "Chickpeas with Beef", category: "Home Cooked Meals", price: 300, description: "Hearty chickpeas cooked with tender beef." },
  { name: "Butter Beans with Beef", category: "Home Cooked Meals", price: 300, description: "Rich butter beans cooked with beef." },
  { name: "Greenpeas with Chicken", category: "Home Cooked Meals", price: 300, description: "Fresh green peas cooked with chicken." },
  { name: "Chicken with Mushroom", category: "Home Cooked Meals", price: 300, description: "Creamy chicken and mushroom dish." },
  { name: "Chicken Potato Stew", category: "Home Cooked Meals", price: 300, description: "Warm and comforting chicken and potato stew." },
  { name: "Musakka with Beef", category: "Home Cooked Meals", price: 300, description: "Traditional Turkish eggplant casserole with minced beef." },

  // 4. Grills & Main Courses
  { name: "Fried Chicken x 1 Piece", category: "Grills & Main Courses", price: 250, description: "1 piece of crispy fried chicken. Served with Fries or Rice & Side Salad." },
  { name: "Fried Chicken x 3 Pieces", category: "Grills & Main Courses", price: 700, description: "3 pieces of crispy fried chicken. Served with Fries or Rice & Side Salad." },
  { name: "Fried Wings x 6 piece", category: "Grills & Main Courses", price: 700, description: "Six pieces of crispy fried chicken wings. Served with Fries or Rice & Side Salad." },
  { name: "Chicken Schnitzel", category: "Grills & Main Courses", price: 700, description: "Breaded and fried chicken cutlet. Served with Fries or Rice & Side Salad." },
  { name: "Grilled Kofte", category: "Grills & Main Courses", price: 600, description: "Turkish style grilled meatballs. Served with Fries or Rice & Side Salad." },
  { name: "Lamb Shish", category: "Grills & Main Courses", price: 700, description: "Succulent cubes of lamb on skewers. Served with Fries or Rice & Side Salad." },
  { name: "Chicken Shish", category: "Grills & Main Courses", price: 700, description: "Marinated chicken skewers. Served with Fries or Rice & Side Salad." },
  { name: "Adana Kebab", category: "Grills & Main Courses", price: 700, description: "Spicy minced meat kebab. Served with Fries or Rice & Side Salad." },
  { name: "Chicken Kebab", category: "Grills & Main Courses", price: 700, description: "Minced chicken kebab. Served with Fries or Rice & Side Salad." },
  { name: "Chicken Thighs", category: "Grills & Main Courses", price: 700, description: "Juicy grilled chicken thighs. Served with Fries or Rice & Side Salad." },
  { name: "Grilled Chicken Wings", category: "Grills & Main Courses", price: 700, description: "Grilled chicken wings. Served with Fries or Rice & Side Salad." },
  { name: "Lamb Chops", category: "Grills & Main Courses", price: 990, description: "Tender and flavorful lamb chops. Served with Fries or Rice & Side Salad." },
  { name: "Mixed Grill", category: "Grills & Main Courses", price: 1600, description: "A combination of our finest grills. Served with Fries or Rice & Side Salad." },

  // 5. Burgers
  { name: "Beef Burger", category: "Burgers", price: 650, description: "Classic beef burger served with Fries & Side Salad." },
  { name: "Chicken Burger", category: "Burgers", price: 500, description: "Delicious chicken burger served with Fries & Side Salad." },
  { name: "Cheeseburger", category: "Burgers", price: 700, description: "Beef burger with melted cheese served with Fries & Side Salad." },

  // 6. Shawarma
  { name: "Shawarma Wrap", category: "Shawarma", price: 350, description: "Authentic shawarma wrap." },
  { name: "Shawarma Wrap + Fries", category: "Shawarma", price: 490, description: "Shawarma with a side of fries." },
  { name: "Shawarma Wrap + Fries + 350ml Soda", category: "Shawarma", price: 550, description: "Shawarma combo with fries and soda." },
  { name: "Shawarma Plate + Fries + Rice + Salad", category: "Shawarma", price: 700, description: "Full shawarma plate combo." },

  // 7. Rotisserie Chicken
  { name: "Half Chicken", category: "Rotisserie Chicken", price: 600, description: "Half rotisserie chicken." },
  { name: "Half Chicken + Rice or Fries", category: "Rotisserie Chicken", price: 700, description: "Half rotisserie chicken with choice of side." },
  { name: "Half Chicken + Rice or Fries + 350ml Soda", category: "Rotisserie Chicken", price: 750, description: "Half rotisserie chicken combo." },
  { name: "Full Chicken", category: "Rotisserie Chicken", price: 1100, description: "Whole rotisserie chicken." },
  { name: "Full Chicken + Rice & Fries", category: "Rotisserie Chicken", price: 1300, description: "Whole rotisserie chicken with sides." },
  { name: "Full Chicken + Rice & Fries + Salad + 1Lt Soda", category: "Rotisserie Chicken", price: 1500, description: "Family size full chicken combo." },

  // 8. Pizza & Turkish Specials
  { name: "Margherita Pizza", category: "Pizza & Turkish Specials", smallPrice: 400, mediumPrice: 600, displayPrice: "400/600", description: "Classic cheese and tomato pizza." },
  { name: "Peri Peri Chicken Pizza", category: "Pizza & Turkish Specials", smallPrice: 500, mediumPrice: 700, displayPrice: "500/700", description: "Spicy peri peri chicken pizza." },
  { name: "Chicken Mushroom Pizza", category: "Pizza & Turkish Specials", smallPrice: 500, mediumPrice: 700, displayPrice: "500/700", description: "Chicken and mushroom pizza." },
  { name: "BBQ Chicken Pizza", category: "Pizza & Turkish Specials", smallPrice: 500, mediumPrice: 700, displayPrice: "500/700", description: "BBQ chicken pizza." },
  { name: "Diavola Pizza", category: "Pizza & Turkish Specials", smallPrice: 500, mediumPrice: 700, displayPrice: "500/700", description: "Spicy diavola pizza." },
  { name: "Beef BBQ Pizza", category: "Pizza & Turkish Specials", smallPrice: 500, mediumPrice: 700, displayPrice: "500/700", description: "Beef BBQ pizza." },
  { name: "Vegetable Pizza", category: "Pizza & Turkish Specials", smallPrice: 500, mediumPrice: 700, displayPrice: "500/700", description: "Vegetarian pizza." },
  { name: "Hawaiian Pizza", category: "Pizza & Turkish Specials", smallPrice: 500, mediumPrice: 700, displayPrice: "500/700", description: "Hawaiian pizza." },
  { name: "Pide (Minced Beef / Cheese)", category: "Pizza & Turkish Specials", price: 800, description: "Traditional Turkish boat-shaped pizza." },
  { name: "Lahmacun", category: "Pizza & Turkish Specials", price: 350, description: "Turkish flatbread topped with minced meat and vegetables." },
  { name: "Extras", category: "Pizza & Turkish Specials", price: 100, description: "Extra toppings." },

  // 9. Salad & Pasta
  { name: "Chicken Caesar Salad", category: "Salad & Pasta", price: 700, description: "Fresh caesar salad with chicken." },
  { name: "Mediterranean Salad", category: "Salad & Pasta", price: 700, description: "Fresh Mediterranean style salad." },
  { name: "Green Salad", category: "Salad & Pasta", price: 400, description: "Simple fresh green salad." },
  { name: "Shepherd's Salad", category: "Salad & Pasta", price: 450, description: "Traditional Turkish Choban salad." },
  { name: "Penne Chicken Mushroom Alfredo", category: "Salad & Pasta", price: 700, description: "Penne pasta with creamy chicken and mushroom sauce." },
  { name: "Spaghetti Bolognese", category: "Salad & Pasta", price: 700, description: "Spaghetti with rich meat sauce." },
  { name: "Spinach & Feta Tagliatelle", category: "Salad & Pasta", price: 700, description: "Tagliatelle pasta with spinach and feta cheese." },

  // 10. Sides
  { name: "Rice", category: "Sides", price: 150, description: "Portion of seasoned rice." },
  { name: "Mashed Potatoes", category: "Sides", price: 150, description: "Creamy mashed potatoes." },
  { name: "Ugali", category: "Sides", price: 100, description: "Traditional Kenyan staple." },
  { name: "French Fries", category: "Sides", price: 150, description: "Crispy french fries." },
  { name: "Side Salad", category: "Sides", price: 150, description: "Fresh side salad." },
  { name: "Plain Yoghurt", category: "Sides", price: 150, description: "Refreshing plain yoghurt." },

  // 11. Middle Eastern Specials
  { name: "Falafel", category: "Middle Eastern Specials", price: 300, description: "Deep-fried chickpea balls." },
  { name: "Fried Kibbeh", category: "Middle Eastern Specials", price: 300, description: "Fried meat and bulgur croquettes." },
  { name: "Babaghannush", category: "Middle Eastern Specials", price: 300, description: "Roasted eggplant dip." },
  { name: "Mutabbal", category: "Middle Eastern Specials", price: 300, description: "Creamy eggplant and tahini dip." },
  { name: "Hummus", category: "Middle Eastern Specials", price: 250, description: "Creamy chickpea and tahini dip." },

  // 12. Desserts
  { name: "Crème Caramel", category: "Desserts", price: 250, description: "Smooth caramel custard." },
  { name: "Rice Pudding", category: "Desserts", price: 250, description: "Traditional baked rice pudding." },
  { name: "Flavoured Puddings - Vanilla / Strawberry / Banana / Chocolate", category: "Desserts", price: 250, description: "Sweet puddings." },
  { name: "Revani", category: "Desserts", price: 250, description: "Moist semolina cake steeped in syrup." },
  { name: "Sekerpare", category: "Desserts", price: 250, description: "Soft almond-based pastry dipped in thick syrup." },

  // 13. Beverages
  { name: "Sodas 350ml", category: "Beverages", price: 90, description: "Refreshing small soda." },
  { name: "Sodas 500ml", category: "Beverages", price: 125, description: "Refreshing medium soda." },
  { name: "Sodas 1lt", category: "Beverages", price: 200, description: "Large soda." },
  { name: "Sodas 2lt", category: "Beverages", price: 300, description: "Extra large soda." },
  { name: "Tonic 500ml", category: "Beverages", price: 135, description: "Tonic water." },
  { name: "Minute Maid 400ml", category: "Beverages", price: 145, description: "Fruit juice." },
  { name: "Lemonade", category: "Beverages", price: 300, description: "Freshly squeezed lemonade." },
  { name: "Strawberry Lemonade", category: "Beverages", price: 350, description: "Refreshing strawberry lemonade." },
  { name: "Ayran", category: "Beverages", price: 300, description: "Traditional Turkish salty yoghurt drink." },
  { name: "Fresh Juices", category: "Beverages", price: 300, description: "Assorted fresh fruit juices." },
  { name: "Milkshakes (Vanilla / Strawberry / Peanut / Mango)", category: "Beverages", price: 500, description: "Delicious milkshakes." },
  { name: "Milkshake (Oreo)", category: "Beverages", price: 550, description: "Thick and creamy Oreo milkshake." },
  { name: "Still Water 500ml", category: "Beverages", price: 90, description: "Bottled mineral water." },
  { name: "Still Water 1Lt", category: "Beverages", price: 160, description: "Bottled mineral water." },
  { name: "Sparkling Water 500ml", category: "Beverages", price: 110, description: "Carbonated mineral water." },
  { name: "Sparkling Water 1Lt", category: "Beverages", price: 180, description: "Carbonated mineral water." },

  // 14. Coffees & Hot Drinks
  { name: "Turkish Coffee", category: "Coffees & Hot Drinks", price: 150, description: "Traditional strong Turkish coffee." },
  { name: "Espresso - Single", category: "Coffees & Hot Drinks", price: 170, description: "Rich and bold single espresso." },
  { name: "Espresso - Double", category: "Coffees & Hot Drinks", price: 200, description: "Rich and bold double espresso." },
  { name: "Americano", category: "Coffees & Hot Drinks", price: 250, description: "Classic Americano." },
  { name: "Cappuccino", category: "Coffees & Hot Drinks", price: 280, description: "Espresso with steamed milk foam." },
  { name: "Latte", category: "Coffees & Hot Drinks", price: 290, description: "Espresso with steamed milk." },
  { name: "Mocha", category: "Coffees & Hot Drinks", price: 320, description: "Espresso with chocolate and milk." },
  { name: "Iced Coffee", category: "Coffees & Hot Drinks", price: 320, description: "Refreshing iced coffee." },
  { name: "Hot Chocolate", category: "Coffees & Hot Drinks", price: 250, description: "Rich hot chocolate." },
  { name: "Turkish Tea", category: "Coffees & Hot Drinks", price: 70, description: "Traditional Turkish black tea." },
  { name: "Black Tea", category: "Coffees & Hot Drinks", price: 100, description: "Classic black tea." },
  { name: "English Tea", category: "Coffees & Hot Drinks", price: 140, description: "English breakfast tea." },
  { name: "Kenyan Tea / Masala Tea", category: "Coffees & Hot Drinks", price: 160, description: "Local Kenyan tea or spiced masala tea." },
  { name: "Herbal Teas", category: "Coffees & Hot Drinks", price: 250, description: "Assorted herbal teas." },
  { name: "Dawa", category: "Coffees & Hot Drinks", price: 250, description: "Traditional Kenyan healing drink." },

  // 15. Mocktails
  { name: "Virgin Mojito", category: "Mocktails", price: 400, description: "Refreshing mint and lime mocktail." },
  { name: "Strawberry Colada", category: "Mocktails", price: 400, description: "Creamy strawberry and coconut mocktail." },
  { name: "Cocktail Ginger Mocktail", category: "Mocktails", price: 400, description: "Zesty ginger mocktail." },
  { name: "Perfect Design", category: "Mocktails", price: 400, description: "Our signature special mocktail." }
];

function inferDishFlags(item) {
  const name = item.name.toLowerCase();
  const desc = item.description ? item.description.toLowerCase() : '';
  const cat = item.category.toLowerCase();
  
  let vegetarian = false;
  if (name.includes('salad') && !name.includes('chicken') && !name.includes('beef') && !name.includes('meat')) {
    vegetarian = true;
  } else if (cat.includes('dessert') || cat.includes('beverage') || cat.includes('mocktail') || cat.includes('coffee') || cat.includes('pastries') || cat.includes('breakfast')) {
    if (!name.includes('chicken') && !name.includes('beef') && !name.includes('lamb') && !name.includes('meat') && !name.includes('sausage') && !name.includes('borek')) {
      vegetarian = true;
    }
  }

  let spicy = false;
  if (name.includes('spicy') || name.includes('diavola') || name.includes('peri peri') || name.includes('adana')) {
    spicy = true;
  }
  
  let popular = false;
  if (name.includes('shawarma') || name.includes('chicken') || name.includes('pizza')) {
    popular = true;
  }

  let featured = false;
  if (name.includes('mix') || name.includes('platter') || name.includes('special') || cat.includes('mocktail')) {
    featured = true;
  }

  return { 
    ...item, 
    vegetarian, 
    spicy, 
    popular, 
    featured,
    preparationTime: 15 
  };
}

async function runMigration() {
  console.log('Starting menu migration...');
  
  try {
    const menuSnapshot = await db.collection('menu').get();
    const existingItems = {}; 
    
    menuSnapshot.docs.forEach(doc => {
      existingItems[doc.data().name.toLowerCase()] = { id: doc.id, ...doc.data() };
    });

    const newMenuNames = new Set();
    
    for (let rawItem of menuData) {
      const item = inferDishFlags(rawItem);
      const nameKey = item.name.toLowerCase();
      newMenuNames.add(nameKey);
      
      const existingDoc = existingItems[nameKey];
      
      if (existingDoc) {
        let updates = {};
        
        if (existingDoc.price !== item.price && item.price !== undefined) updates.price = item.price;
        if (existingDoc.smallPrice !== item.smallPrice && item.smallPrice !== undefined) updates.smallPrice = item.smallPrice;
        if (existingDoc.mediumPrice !== item.mediumPrice && item.mediumPrice !== undefined) updates.mediumPrice = item.mediumPrice;
        if (existingDoc.displayPrice !== item.displayPrice && item.displayPrice !== undefined) updates.displayPrice = item.displayPrice;
        
        if (existingDoc.category !== item.category) updates.category = item.category;
        if (existingDoc.description !== item.description) updates.description = item.description;
        if (existingDoc.available !== true) updates.available = true;
        
        if (!existingDoc.imageUrl && existingDoc.imageUrl !== "") {
          updates.imageUrl = "";
        }

        if (Object.keys(updates).length > 0) {
          updates.updatedAt = FieldValue.serverTimestamp();
          await db.collection('menu').doc(existingDoc.id).update(updates);
        }
      } else {
        const newDoc = {
          ...item,
          available: true,
          imageUrl: "", 
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        };
        await db.collection('menu').add(newDoc);
      }
    }

    // Mark missing items as unavailable or delete if duplicate pizza
    for (let key in existingItems) {
      if (!newMenuNames.has(key)) {
        const existingDoc = existingItems[key];
        const isPizza = (existingDoc.category || '').toLowerCase().includes('pizza') || (existingDoc.name || '').toLowerCase().includes('pizza');
        if (isPizza) {
          console.log(`Deleting duplicate/old pizza: ${existingDoc.name}`);
          await db.collection('menu').doc(existingDoc.id).delete();
        } else if (existingDoc.available !== false) {
          await db.collection('menu').doc(existingDoc.id).update({
            available: false,
            updatedAt: FieldValue.serverTimestamp()
          });
        }
      }
    }

    // VERIFICATION
    const finalSnapshot = await db.collection('menu').get();
    const finalDocs = finalSnapshot.docs.map(d => d.data());
    
    const categories = new Set();
    finalDocs.forEach(d => {
      if (d.available) categories.add(d.category);
    });
    
    console.log('\nCategories found:');
    Array.from(categories).sort().forEach(c => console.log(`- ${c}`));

    console.log(`\nTotal documents inside the menu collection: ${finalDocs.length}`);
    
    const checks = [
      "Turkish Coffee",
      "Virgin Mojito",
      "Half Chicken",
      "Mediterranean Salad",
      "Penne Chicken Mushroom Alfredo",
      "Chicken Caesar Salad",
      "Cappuccino",
      "Ayran",
      "Crème Caramel",
      "Revani"
    ];

    console.log('\nVerifying required documents:');
    let allPassed = true;
    for (let check of checks) {
      const found = finalDocs.some(d => d.name === check && d.available);
      if (found) {
        console.log(`✓ ${check}`);
      } else {
        console.log(`✗ ${check} (MISSING)`);
        allPassed = false;
      }
    }

    if (!allPassed) {
      console.log('\nVERIFICATION FAILED!');
      process.exit(1);
    } else {
      console.log('\nVERIFICATION PASSED!');
      process.exit(0);
    }

  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

runMigration();
