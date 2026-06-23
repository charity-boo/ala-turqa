import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

export const menuSeedData = [
  // BREAKFAST
  {
    name: "Ispanakli Borek",
    category: "Breakfast",
    price: 270,
    description: "Traditional flaky Turkish pastry filled with fresh spinach and delicate spices.",
    featured: false,
    popular: false,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "10"
  },
  {
    name: "Patatesli Borek",
    category: "Breakfast",
    price: 270,
    description: "Crispy layers of phyllo dough stuffed with seasoned mashed potatoes.",
    featured: false,
    popular: false,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "10"
  },
  {
    name: "Kiymali Borek",
    category: "Breakfast",
    price: 270,
    description: "Savory Turkish pastry packed with premium minced beef and herbs.",
    featured: true,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "10"
  },
  {
    name: "Kasarli Borek",
    category: "Breakfast",
    price: 270,
    description: "Warm and comforting phyllo pastry filled with melted Turkish Kasar cheese.",
    featured: false,
    popular: true,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "10"
  },
  {
    name: "Patates Kasarli Borek",
    category: "Breakfast",
    price: 270,
    description: "The perfect combination of seasoned potatoes and melted cheese in a crispy pastry.",
    featured: false,
    popular: false,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "10"
  },
  {
    name: "Kiymali Gozleme",
    category: "Breakfast",
    price: 270,
    description: "Traditional hand-rolled flatbread stuffed with spiced minced meat, cooked on a griddle.",
    featured: true,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "15"
  },
  {
    name: "Patates Kasarli Gozleme",
    category: "Breakfast",
    price: 270,
    description: "Griddle-cooked Turkish flatbread filled with seasoned potatoes and melted Kasar cheese.",
    featured: false,
    popular: false,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "15"
  },
  {
    name: "Ispanakli Gozleme",
    category: "Breakfast",
    price: 270,
    description: "Fresh spinach and feta folded into a thin flatbread and griddled to perfection.",
    featured: false,
    popular: false,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "15"
  },
  {
    name: "Kiymali Samosa",
    category: "Breakfast",
    price: 100,
    description: "Crispy fried pastry triangles filled with spiced minced meat.",
    featured: false,
    popular: false,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "5"
  },
  {
    name: "Tavuklu Samosa",
    category: "Breakfast",
    price: 100,
    description: "Golden fried samosas packed with flavorful minced chicken.",
    featured: false,
    popular: false,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "5"
  },
  {
    name: "Peynirli Samosa",
    category: "Breakfast",
    price: 100,
    description: "Crispy samosas filled with a delicious blend of melted cheeses.",
    featured: false,
    popular: true,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "5"
  },
  {
    name: "Omelet",
    category: "Breakfast",
    price: 300,
    description: "Classic fluffy omelet prepared with fresh eggs and a dash of seasoning.",
    featured: false,
    popular: false,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "10"
  },
  {
    name: "Menemen",
    category: "Breakfast",
    price: 400,
    description: "Traditional Turkish skillet of eggs gently scrambled with fresh tomatoes, green peppers, and spices.",
    featured: true,
    popular: true,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "15"
  },
  {
    name: "Chapati",
    category: "Breakfast",
    price: 50,
    description: "Soft, warm, and freshly made unleavened flatbread.",
    featured: false,
    popular: false,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "5"
  },
  {
    name: "Breakfast Wrap",
    category: "Breakfast",
    price: 300,
    description: "A hearty morning wrap filled with eggs, cheese, and fresh veggies.",
    featured: false,
    popular: false,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "10"
  },
  {
    name: "Panini",
    category: "Breakfast",
    price: 350,
    description: "Toasted and pressed sandwich with a selection of fresh daily fillings.",
    featured: false,
    popular: false,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "10"
  },

  // GRILL & BBQ
  {
    name: "Chicken Shish",
    category: "Grill & BBQ",
    price: 700,
    description: "Tender, marinated chicken breast cubes grilled to perfection on a skewer.",
    featured: true,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "20"
  },
  {
    name: "Lamb Shish",
    category: "Grill & BBQ",
    price: 700,
    description: "Succulent cubes of marinated lamb, flame-grilled for a smoky, rich flavor.",
    featured: true,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "25"
  },
  {
    name: "Shawarma",
    category: "Grill & BBQ",
    price: 700,
    description: "Thinly sliced, perfectly seasoned roasted meat served with garlic sauce and fresh vegetables.",
    featured: true,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "10"
  },
  {
    name: "Chicken Thigh",
    category: "Grill & BBQ",
    price: 700,
    description: "Juicy and tender grilled chicken thighs marinated in traditional Turkish spices.",
    featured: false,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "20"
  },
  {
    name: "Chicken Kebab",
    category: "Grill & BBQ",
    price: 700,
    description: "Hand-minced chicken blended with herbs and spices, grilled on a wide skewer.",
    featured: false,
    popular: false,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "20"
  },
  {
    name: "Lamb Kebab",
    category: "Grill & BBQ",
    price: 700,
    description: "Classic Adana-style hand-minced lamb kebab, spiced and grilled over charcoal.",
    featured: true,
    popular: true,
    vegetarian: false,
    spicy: true,
    available: true,
    preparationTime: "25"
  },

  // BURGERS
  {
    name: "Beef Burger",
    category: "Burgers",
    price: 600,
    description: "Juicy, flame-grilled beef patty served with fresh lettuce, tomato, and our signature sauce.",
    featured: false,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "15"
  },
  {
    name: "Cheeseburger",
    category: "Burgers",
    price: 700,
    description: "Our classic beef burger topped with a thick slice of melted cheddar cheese.",
    featured: false,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "15"
  },
  {
    name: "Chicken Burger",
    category: "Burgers",
    price: 600,
    description: "Crispy coated or grilled chicken breast with mayo and crisp greens in a soft bun.",
    featured: false,
    popular: false,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "15"
  },

  // TURKISH MAIN MEALS
  {
    name: "Etli Kuru Fasulye",
    category: "Turkish Main Meals",
    price: 450,
    description: "Traditional slow-cooked white bean stew with tender pieces of beef in a rich tomato sauce.",
    featured: true,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "15"
  },
  {
    name: "Etli Nohut",
    category: "Turkish Main Meals",
    price: 450,
    description: "Hearty chickpea stew slow-cooked with beef and aromatic Turkish spices.",
    featured: false,
    popular: false,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "15"
  },
  {
    name: "Tavuklu Bezelye",
    category: "Turkish Main Meals",
    price: 450,
    description: "Comforting green pea and potato stew prepared with tender chicken pieces.",
    featured: false,
    popular: false,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "15"
  },
  {
    name: "Patatesli Tavuk Haslama",
    category: "Turkish Main Meals",
    price: 450,
    description: "A soothing, clear broth chicken stew with potatoes and carrots.",
    featured: false,
    popular: false,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "15"
  },
  {
    name: "Tavuk Ciger Sote",
    category: "Turkish Main Meals",
    price: 450,
    description: "Pan-sautéed chicken livers with onions, peppers, and authentic spices.",
    featured: false,
    popular: false,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "15"
  },
  {
    name: "Mantarli Et Sote",
    category: "Turkish Main Meals",
    price: 450,
    description: "Sautéed premium beef chunks with fresh mushrooms, tomatoes, and peppers.",
    featured: true,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "20"
  },
  {
    name: "Mantarli Tavuk Sote",
    category: "Turkish Main Meals",
    price: 450,
    description: "Sautéed chicken breast pieces mixed with fresh mushrooms and vibrant vegetables.",
    featured: false,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "20"
  },
  {
    name: "Patlican Musakka",
    category: "Turkish Main Meals",
    price: 450,
    description: "Classic Turkish moussaka: layers of fried eggplant topped with rich minced meat sauce.",
    featured: true,
    popular: false,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "15"
  },
  {
    name: "Pilav",
    category: "Turkish Main Meals",
    price: 150,
    description: "Fluffy, buttery Turkish-style rice pilaf with orzo. The perfect side dish.",
    featured: false,
    popular: true,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "5"
  },

  // TURKISH PAN SPECIALS
  {
    name: "Chicken Fajita",
    category: "Turkish Pan Specials",
    price: 700,
    description: "Sizzling marinated chicken strips cooked with bell peppers and onions.",
    featured: false,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "20"
  },
  {
    name: "Beef Fajita",
    category: "Turkish Pan Specials",
    price: 700,
    description: "Sizzling tender beef strips cooked with a colorful mix of peppers and onions.",
    featured: false,
    popular: false,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "20"
  },
  {
    name: "Sac Kavurma Beef",
    category: "Turkish Pan Specials",
    price: 700,
    description: "A Turkish classic! Diced beef flash-fried on an authentic iron pan with tomatoes and green peppers.",
    featured: true,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "25"
  },
  {
    name: "Sac Kavurma Chicken",
    category: "Turkish Pan Specials",
    price: 700,
    description: "Diced chicken breast pan-fried on a traditional iron 'Sac' with fresh vegetables and spices.",
    featured: false,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "20"
  },

  // PIZZA & PIDE
  {
    name: "Margherita Pizza",
    category: "Pizza & Pide",
    price: 500,
    description: "Classic pizza with rich tomato sauce, fresh mozzarella, and a hint of basil.",
    featured: false,
    popular: false,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "20"
  },
  {
    name: "Chicken Pizza",
    category: "Pizza & Pide",
    price: 800,
    description: "Delicious pizza topped with seasoned chicken, mozzarella, and vegetables.",
    featured: false,
    popular: false,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "20"
  },
  {
    name: "Pide",
    category: "Pizza & Pide",
    price: 500,
    description: "Traditional boat-shaped Turkish flatbread baked with a savory mixture of cheese and minced meat.",
    featured: true,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "20"
  },

  // APPETIZERS & SALADS
  {
    name: "Hummus",
    category: "Appetizers & Salads",
    price: 200,
    description: "Creamy blend of chickpeas, tahini, lemon, and garlic, drizzled with olive oil.",
    featured: false,
    popular: true,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "5"
  },
  {
    name: "Baba Ghanoush",
    category: "Appetizers & Salads",
    price: 200,
    description: "Smoky roasted eggplant dip blended with tahini, olive oil, and herbs.",
    featured: false,
    popular: false,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "5"
  },
  {
    name: "Mutabbal",
    category: "Appetizers & Salads",
    price: 200,
    description: "Rich and creamy roasted eggplant dip with yogurt and tahini.",
    featured: false,
    popular: false,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "5"
  },
  {
    name: "Falafel",
    category: "Appetizers & Salads",
    price: 200,
    description: "Crispy, golden-fried patties made from ground chickpeas and middle-eastern spices.",
    featured: true,
    popular: true,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "10"
  },
  {
    name: "Kebbe Fried",
    category: "Appetizers & Salads",
    price: 250,
    description: "Crispy bulgur wheat shells stuffed with seasoned minced meat and pine nuts.",
    featured: false,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "10"
  },
  {
    name: "Greek Salad",
    category: "Appetizers & Salads",
    price: 250,
    description: "Fresh tomatoes, cucumbers, red onions, olives, and feta cheese, dressed with olive oil.",
    featured: false,
    popular: true,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "10"
  },
  {
    name: "Green Salad",
    category: "Appetizers & Salads",
    price: 200,
    description: "A crisp mix of seasonal greens, cucumbers, and a light lemon vinaigrette.",
    featured: false,
    popular: false,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "10"
  },

  // ALA TURQA BITES
  {
    name: "Loaded Belgian Fries",
    category: "Ala Turqa Bites",
    price: 300,
    description: "Crispy, thick-cut fries smothered in melted cheese and signature sauces.",
    featured: true,
    popular: true,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "10"
  },
  {
    name: "Long Potato Strips",
    category: "Ala Turqa Bites",
    price: 250,
    description: "Extra-long, perfectly salted crispy potato fries.",
    featured: false,
    popular: false,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "10"
  },
  {
    name: "Spiral Potato",
    category: "Ala Turqa Bites",
    price: 250,
    description: "Fun and crispy spiral-cut potato on a stick, lightly seasoned.",
    featured: false,
    popular: true,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "10"
  },

  // DESSERTS
  {
    name: "Sutlac",
    category: "Desserts",
    price: 150,
    description: "Traditional Turkish baked rice pudding with a perfectly caramelized top.",
    featured: true,
    popular: true,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "5"
  },
  {
    name: "Tulumba",
    category: "Desserts",
    price: 150,
    description: "Crispy, deep-fried dough soaked in a sweet, aromatic sugar syrup.",
    featured: false,
    popular: false,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "5"
  },
  {
    name: "Trilece",
    category: "Desserts",
    price: 150,
    description: "Light and airy sponge cake soaked in three milks, topped with a soft caramel glaze.",
    featured: true,
    popular: true,
    vegetarian: true,
    spicy: false,
    available: true,
    preparationTime: "5"
  },

  // TURKISH SPECIALS
  {
    name: "Maklube",
    category: "Turkish Specials",
    price: 1500,
    description: "An impressive, layered centerpiece dish of rice, tender meat, and fried vegetables, served inverted.",
    featured: true,
    popular: true,
    vegetarian: false,
    spicy: false,
    available: true,
    preparationTime: "40"
  }
];

export const seedMenuDatabase = async () => {
  try {
    console.log("Starting menu seeding...");
    const batch = writeBatch(db);
    const menuRef = collection(db, "menu");

    menuSeedData.forEach((item) => {
      const docRef = doc(menuRef); // Generate auto-id
      batch.set(docRef, {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
        image: "" // Placeholder for future images
      });
    });

    await batch.commit();
    console.log("Successfully seeded", menuSeedData.length, "menu items!");
    return { success: true, count: menuSeedData.length };
  } catch (error) {
    console.error("Error seeding database:", error);
    return { success: false, error };
  }
};
