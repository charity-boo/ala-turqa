const initialMenuItems = [
  // PASTRIES & SNACKS
  {
    name: "Gozleme - Minced Beef", category: "Pastries & Snacks", price: 250, description: "Traditional Turkish flatbread stuffed with minced beef.", image: "gozleme-beef.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Gozleme - Potato & Cheese", category: "Pastries & Snacks", price: 250, description: "Traditional Turkish flatbread stuffed with potato and cheese.", image: "gozleme-potato-cheese.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Gozleme - Chicken & Mushroom", category: "Pastries & Snacks", price: 250, description: "Traditional Turkish flatbread stuffed with chicken and mushroom.", image: "gozleme-chicken-mushroom.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Gozleme - Spinach & Feta", category: "Pastries & Snacks", price: 250, description: "Traditional Turkish flatbread stuffed with spinach and feta cheese.", image: "gozleme-spinach-feta.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Cig Borek", category: "Pastries & Snacks", price: 250, description: "Deep-fried turnover stuffed with your choice of beef or cheese.", image: "cig-borek.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Samosa", category: "Pastries & Snacks", price: 100, description: "Crispy pastry filled with minced beef, chicken, or feta & coriander.", image: "samosa.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Chapati", category: "Pastries & Snacks", price: 70, description: "Soft and flaky flatbread.", image: "chapati.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Pogaca", category: "Pastries & Snacks", price: 100, description: "Soft Turkish bread rolls filled with potato, minced beef, or mozzarella.", image: "pogaca.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Lavash", category: "Pastries & Snacks", price: 70, description: "Thin and soft flatbread.", image: "lavash.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Gozleme + Fries + Soda", category: "Pastries & Snacks", price: 350, description: "Gozleme combo with fries and a soda.", image: "gozleme-combo.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },

  // BREAKFAST
  {
    name: "Fried Eggs", category: "Breakfast", price: 150, description: "Simple and delicious fried eggs.", image: "fried-eggs.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Scrambled Eggs", category: "Breakfast", price: 200, description: "Soft, fluffy scrambled eggs.", image: "scrambled-eggs.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Omelette (Plain)", category: "Breakfast", price: 200, description: "Classic folded omelette.", image: "omelette.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Omelette (Cheese / Mushroom / Spanish)", category: "Breakfast", price: 250, description: "Omelette with choice of cheese, mushroom, or Spanish style.", image: "omelette-stuffed.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Menemen", category: "Breakfast", price: 300, description: "Traditional Turkish scrambled eggs with tomatoes, green peppers, and optional onions.", image: "menemen.jpg",
    featured: true, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Panini's (Halloumi / Chicken)", category: "Breakfast", price: 350, description: "Toasted panini with your choice of Halloumi cheese or Chicken & Mayo.", image: "panini.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Sausages x 2 pieces", category: "Breakfast", price: 150, description: "Tasty breakfast sausage.", image: "sausage.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Falafel Wrap", category: "Breakfast", price: 250, description: "Crispy falafel wrapped in flatbread with fresh veggies.", image: "falafel-wrap.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "English Breakfast", category: "Breakfast", price: 500, description: "Eggs, Sausage, Baked Beans, Mushrooms, Grilled Tomatoes & Toasted Bread.", image: "english-breakfast.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 20
  },

  // HOME COOKED MEALS
  {
    name: "Soup of the Day", category: "Home Cooked Meals", price: 200, description: "Fresh daily soup.", image: "soup.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Chickpeas with Beef", category: "Home Cooked Meals", price: 300, description: "Hearty chickpeas cooked with tender beef.", image: "chickpeas-beef.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Butter Beans with Beef", category: "Home Cooked Meals", price: 300, description: "Rich butter beans cooked with beef.", image: "butter-beans-beef.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Greenpeas with Chicken", category: "Home Cooked Meals", price: 300, description: "Fresh green peas cooked with chicken.", image: "greenpeas-chicken.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Chicken with Mushroom", category: "Home Cooked Meals", price: 300, description: "Creamy chicken and mushroom dish.", image: "chicken-mushroom.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Chicken Potato Stew", category: "Home Cooked Meals", price: 300, description: "Warm and comforting chicken and potato stew.", image: "chicken-potato-stew.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Musakka with Beef", category: "Home Cooked Meals", price: 300, description: "Traditional Turkish eggplant casserole with minced beef.", image: "musakka-beef.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },

  // GRILLS & MAIN COURSES
  {
    name: "Fried Chicken x 1 Piece", category: "Grills & Main Courses", price: 250, description: "1 piece of crispy fried chicken. Served with Fries or Rice & Side Salad.", image: "fried-chicken-1.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 20
  },
  {
    name: "Fried Chicken x 3 Pieces", category: "Grills & Main Courses", price: 700, description: "3 pieces of crispy fried chicken. Served with Fries or Rice & Side Salad.", image: "fried-chicken.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 20
  },
  {
    name: "Fried Wings x 6 piece", category: "Grills & Main Courses", price: 700, description: "Six pieces of crispy fried chicken wings. Served with Fries or Rice & Side Salad.", image: "fried-wings.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Chicken Schnitzel", category: "Grills & Main Courses", price: 700, description: "Breaded and fried chicken cutlet. Served with Fries or Rice & Side Salad.", image: "chicken-schnitzel.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 20
  },
  {
    name: "Grilled Kofte", category: "Grills & Main Courses", price: 600, description: "Turkish style grilled meatballs. Served with Fries or Rice & Side Salad.", image: "grilled-kofte.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 20
  },
  {
    name: "Lamb Shish", category: "Grills & Main Courses", price: 700, description: "Succulent cubes of lamb on skewers. Served with Fries or Rice & Side Salad.", image: "lamb-shish.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 20
  },
  {
    name: "Chicken Shish", category: "Grills & Main Courses", price: 700, description: "Marinated chicken skewers. Served with Fries or Rice & Side Salad.", image: "chicken-shish.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 20
  },
  {
    name: "Adana Kebab", category: "Grills & Main Courses", price: 700, description: "Spicy minced meat kebab. Served with Fries or Rice & Side Salad.", image: "adana-kebab.jpg",
    featured: true, popular: true, vegetarian: false, spicy: true, available: true, preparationTime: 20
  },
  {
    name: "Chicken Kebab", category: "Grills & Main Courses", price: 700, description: "Minced chicken kebab. Served with Fries or Rice & Side Salad.", image: "chicken-kebab.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 20
  },
  {
    name: "Chicken Thighs", category: "Grills & Main Courses", price: 700, description: "Juicy grilled chicken thighs. Served with Fries or Rice & Side Salad.", image: "chicken-thighs.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 20
  },
  {
    name: "Grilled Chicken Wings", category: "Grills & Main Courses", price: 700, description: "Grilled chicken wings. Served with Fries or Rice & Side Salad.", image: "grilled-wings.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 20
  },
  {
    name: "Lamb Chops", category: "Grills & Main Courses", price: 990, description: "Tender and flavorful lamb chops. Served with Fries or Rice & Side Salad.", image: "lamb-chops.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 25
  },
  {
    name: "Mixed Grill", category: "Grills & Main Courses", price: 1600, description: "A combination of our finest grills. Served with Fries or Rice & Side Salad.", image: "mixed-grill.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 30
  },

  // BURGERS
  {
    name: "Beef Burger", category: "Burgers", price: 650, description: "Classic beef burger served with Fries & Side Salad.", image: "beef-burger.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Chicken Burger", category: "Burgers", price: 500, description: "Delicious chicken burger served with Fries & Side Salad.", image: "chicken-burger.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Cheeseburger", category: "Burgers", price: 700, description: "Beef burger with melted cheese served with Fries & Side Salad.", image: "cheeseburger.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },

  // SHAWARMA
  {
    name: "Shawarma Wrap", category: "Shawarma", price: 350, description: "Authentic shawarma wrap.", image: "shawarma-wrap.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Shawarma Wrap + Fries", category: "Shawarma", price: 490, description: "Shawarma with a side of fries.", image: "shawarma-fries.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Shawarma Wrap + Fries + 350ml Soda", category: "Shawarma", price: 550, description: "Shawarma combo with fries and soda.", image: "shawarma-fries-soda.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Shawarma Plate + Fries + Rice + Salad", category: "Shawarma", price: 700, description: "Full shawarma plate combo.", image: "shawarma-plate.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },

  // ROTISSERIE CHICKEN
  {
    name: "Half Chicken", category: "Rotisserie Chicken", price: 600, description: "Half rotisserie chicken.", image: "half-chicken.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 20
  },
  {
    name: "Half Chicken + Rice or Fries", category: "Rotisserie Chicken", price: 700, description: "Half rotisserie chicken with choice of side.", image: "half-chicken-side.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 20
  },
  {
    name: "Half Chicken + Rice or Fries + 350ml Soda", category: "Rotisserie Chicken", price: 750, description: "Half rotisserie chicken combo.", image: "half-chicken-combo.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 20
  },
  {
    name: "Full Chicken", category: "Rotisserie Chicken", price: 1100, description: "Whole rotisserie chicken.", image: "full-chicken.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 25
  },
  {
    name: "Full Chicken + Rice & Fries", category: "Rotisserie Chicken", price: 1300, description: "Whole rotisserie chicken with sides.", image: "full-chicken-sides.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 25
  },
  {
    name: "Full Chicken + Rice & Fries + Salad + 1Lt Soda", category: "Rotisserie Chicken", price: 1500, description: "Family size full chicken combo.", image: "full-chicken-combo.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 25
  },

  // PIZZA & TURKISH SPECIALS
  {
    name: "Margherita Pizza (Small)", category: "Pizza & Turkish Specials", price: 400, description: "Classic cheese and tomato pizza (Small).", image: "margherita-s.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Margherita Pizza (Medium)", category: "Pizza & Turkish Specials", price: 600, description: "Classic cheese and tomato pizza (Medium).", image: "margherita-m.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Peri Peri Chicken Pizza (Small)", category: "Pizza & Turkish Specials", price: 500, description: "Small spicy peri peri chicken pizza.", image: "peri-peri-pizza-s.jpg",
    featured: false, popular: true, vegetarian: false, spicy: true, available: true, preparationTime: 15
  },
  {
    name: "Peri Peri Chicken Pizza (Medium)", category: "Pizza & Turkish Specials", price: 700, description: "Medium spicy peri peri chicken pizza.", image: "peri-peri-pizza-m.jpg",
    featured: true, popular: true, vegetarian: false, spicy: true, available: true, preparationTime: 15
  },
  {
    name: "Chicken Mushroom Pizza (Small)", category: "Pizza & Turkish Specials", price: 500, description: "Small chicken and mushroom pizza.", image: "chicken-mushroom-pizza-s.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Chicken Mushroom Pizza (Medium)", category: "Pizza & Turkish Specials", price: 700, description: "Medium chicken and mushroom pizza.", image: "chicken-mushroom-pizza-m.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Barbeque Chicken Pizza (Small)", category: "Pizza & Turkish Specials", price: 500, description: "Small BBQ chicken pizza.", image: "bbq-chicken-pizza-s.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Barbeque Chicken Pizza (Medium)", category: "Pizza & Turkish Specials", price: 700, description: "Medium BBQ chicken pizza.", image: "bbq-chicken-pizza-m.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Diavola Pizza (Small)", category: "Pizza & Turkish Specials", price: 500, description: "Small spicy diavola pizza.", image: "diavola-pizza-s.jpg",
    featured: false, popular: false, vegetarian: false, spicy: true, available: true, preparationTime: 15
  },
  {
    name: "Diavola Pizza (Medium)", category: "Pizza & Turkish Specials", price: 700, description: "Medium spicy diavola pizza.", image: "diavola-pizza-m.jpg",
    featured: false, popular: false, vegetarian: false, spicy: true, available: true, preparationTime: 15
  },
  {
    name: "Beef Barbeque Pizza (Small)", category: "Pizza & Turkish Specials", price: 500, description: "Small beef BBQ pizza.", image: "beef-bbq-pizza-s.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Beef Barbeque Pizza (Medium)", category: "Pizza & Turkish Specials", price: 700, description: "Medium beef BBQ pizza.", image: "beef-bbq-pizza-m.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Vegetable Pizza (Small)", category: "Pizza & Turkish Specials", price: 500, description: "Small vegetarian pizza.", image: "vegetable-pizza-s.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Vegetable Pizza (Medium)", category: "Pizza & Turkish Specials", price: 700, description: "Medium vegetarian pizza.", image: "vegetable-pizza-m.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Hawaian Pizza (Small)", category: "Pizza & Turkish Specials", price: 500, description: "Small Hawaiian pizza.", image: "hawaian-pizza-s.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Hawaian Pizza (Medium)", category: "Pizza & Turkish Specials", price: 700, description: "Medium Hawaiian pizza.", image: "hawaian-pizza-m.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Pide (Minced Beef / Cheese)", category: "Pizza & Turkish Specials", price: 800, description: "Traditional Turkish boat-shaped pizza.", image: "pide.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 20
  },
  {
    name: "Lahmacun", category: "Pizza & Turkish Specials", price: 350, description: "Turkish flatbread topped with minced meat and vegetables.", image: "lahmacun.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Pizza Extras", category: "Pizza & Turkish Specials", price: 100, description: "Extra toppings.", image: "pizza-extras.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 0
  },

  // SALAD & PASTA
  {
    name: "Chicken Ceasar Salad", category: "Salad & Pasta", price: 700, description: "Fresh caesar salad with chicken.", image: "chicken-caesar.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Mediterranean Salad", category: "Salad & Pasta", price: 700, description: "Fresh Mediterranean style salad.", image: "mediterranean-salad.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Green Salad", category: "Salad & Pasta", price: 400, description: "Simple fresh green salad.", image: "green-salad.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Shepherd's Salad", category: "Salad & Pasta", price: 450, description: "Traditional Turkish Choban salad.", image: "shepherds-salad.jpg",
    featured: true, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Penne Chicken Mushroom Alfredo", category: "Salad & Pasta", price: 700, description: "Penne pasta with creamy chicken and mushroom sauce.", image: "penne-alfredo.jpg",
    featured: true, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Spaghetti Bolognese", category: "Salad & Pasta", price: 700, description: "Spaghetti with rich meat sauce.", image: "spaghetti-bolognese.jpg",
    featured: false, popular: true, vegetarian: false, spicy: false, available: true, preparationTime: 15
  },
  {
    name: "Spinach & Feta Tagliatelle", category: "Salad & Pasta", price: 700, description: "Tagliatelle pasta with spinach and feta cheese.", image: "spinach-feta-pasta.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 15
  },

  // SIDES
  {
    name: "Rice", category: "Sides", price: 150, description: "Portion of seasoned rice.", image: "rice.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Mashed Potatoes", category: "Sides", price: 150, description: "Creamy mashed potatoes.", image: "mashed-potatoes.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Ugali", category: "Sides", price: 100, description: "Traditional Kenyan staple.", image: "ugali.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "French Fries", category: "Sides", price: 150, description: "Crispy french fries.", image: "fries.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Side Salad", category: "Sides", price: 150, description: "Fresh side salad.", image: "side-salad.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Plain Yoghurt", category: "Sides", price: 150, description: "Refreshing plain yoghurt.", image: "plain-yoghurt.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },

  // MIDDLE EASTERN SPECIALS
  {
    name: "Falafel", category: "Middle Eastern Specials", price: 300, description: "Deep-fried chickpea balls.", image: "falafel.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Fried Kibbeh", category: "Middle Eastern Specials", price: 300, description: "Fried meat and bulgur croquettes.", image: "kibbeh.jpg",
    featured: false, popular: false, vegetarian: false, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Babaghannush", category: "Middle Eastern Specials", price: 300, description: "Roasted eggplant dip.", image: "babaghannush.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Mutabbal", category: "Middle Eastern Specials", price: 300, description: "Creamy eggplant and tahini dip.", image: "mutabbal.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Hummus", category: "Middle Eastern Specials", price: 250, description: "Creamy chickpea and tahini dip.", image: "hummus.jpg",
    featured: true, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },

  // DESSERTS
  {
    name: "Creme Caramel", category: "Desserts", price: 250, description: "Smooth caramel custard.", image: "creme-caramel.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Rice Pudding (Sutlac)", category: "Desserts", price: 250, description: "Traditional baked rice pudding.", image: "sutlac.jpg",
    featured: true, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Flavoured Puddings", category: "Desserts", price: 250, description: "Vanilla / Strawberry / Banana / Chocolate.", image: "flavoured-puddings.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Revani", category: "Desserts", price: 250, description: "Moist semolina cake steeped in syrup.", image: "revani.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Sekerpare", category: "Desserts", price: 250, description: "Soft almond-based pastry dipped in thick syrup.", image: "sekerpare.jpg",
    featured: true, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },

  // BEVERAGES
  {
    name: "Sodas 350ml / 500ml", category: "Beverages", price: 125, description: "Refreshing sodas.", image: "soda-small.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Sodas 1lt / 2lt", category: "Beverages", price: 300, description: "Large sodas for sharing.", image: "soda-large.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Tonic 500ml", category: "Beverages", price: 135, description: "Tonic water.", image: "tonic.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Minute Maid 400ml", category: "Beverages", price: 145, description: "Fruit juice.", image: "minute-maid.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Lemonade", category: "Beverages", price: 300, description: "Freshly squeezed lemonade.", image: "lemonade.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Strawberry Lemonade", category: "Beverages", price: 350, description: "Refreshing strawberry lemonade.", image: "strawberry-lemonade.jpg",
    featured: true, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Ayran", category: "Beverages", price: 300, description: "Traditional Turkish salty yoghurt drink.", image: "ayran.jpg",
    featured: true, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Fresh Juices", category: "Beverages", price: 300, description: "Assorted fresh fruit juices.", image: "fresh-juice.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Milkshakes", category: "Beverages", price: 500, description: "Vanilla / Strawberry / Peanut / Mango.", image: "milkshake.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Oreo Milkshake", category: "Beverages", price: 550, description: "Thick and creamy Oreo milkshake.", image: "oreo-milkshake.jpg",
    featured: true, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Still Water 500ml / 1Lt", category: "Beverages", price: 160, description: "Bottled mineral water.", image: "water.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Sparkling Water 500ml / 1Lt", category: "Beverages", price: 180, description: "Carbonated mineral water.", image: "sparkling-water.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },

  // COFFEES & HOT DRINKS
  {
    name: "Turkish Coffee", category: "Coffees & Hot Drinks", price: 150, description: "Traditional strong Turkish coffee.", image: "turkish-coffee.jpg",
    featured: true, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 10
  },
  {
    name: "Espresso - Single / Double", category: "Coffees & Hot Drinks", price: 200, description: "Rich and bold espresso.", image: "espresso.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Americano", category: "Coffees & Hot Drinks", price: 250, description: "Classic Americano.", image: "americano.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Cappuccino", category: "Coffees & Hot Drinks", price: 280, description: "Espresso with steamed milk foam.", image: "cappuccino.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Latte", category: "Coffees & Hot Drinks", price: 290, description: "Espresso with steamed milk.", image: "latte.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Mocha", category: "Coffees & Hot Drinks", price: 320, description: "Espresso with chocolate and milk.", image: "mocha.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Iced Coffee", category: "Coffees & Hot Drinks", price: 320, description: "Refreshing iced coffee.", image: "iced-coffee.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Hot Chocolate", category: "Coffees & Hot Drinks", price: 250, description: "Rich hot chocolate.", image: "hot-chocolate.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Turkish Tea", category: "Coffees & Hot Drinks", price: 70, description: "Traditional Turkish black tea.", image: "turkish-tea.jpg",
    featured: true, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Black Tea", category: "Coffees & Hot Drinks", price: 100, description: "Classic black tea.", image: "black-tea.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "English Tea", category: "Coffees & Hot Drinks", price: 140, description: "English breakfast tea.", image: "english-tea.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Kenyan Tea / Masala Tea", category: "Coffees & Hot Drinks", price: 160, description: "Local Kenyan tea or spiced masala tea.", image: "kenyan-tea.jpg",
    featured: true, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Herbal Teas", category: "Coffees & Hot Drinks", price: 250, description: "Assorted herbal teas.", image: "herbal-tea.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Dawa", category: "Coffees & Hot Drinks", price: 250, description: "Traditional Kenyan healing drink with lemon, ginger, and honey.", image: "dawa.jpg",
    featured: true, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },

  // MOCKTAILS
  {
    name: "Virgin Mojito", category: "Mocktails", price: 400, description: "Refreshing mint and lime mocktail.", image: "virgin-mojito.jpg",
    featured: true, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Strawberry Colada", category: "Mocktails", price: 400, description: "Creamy strawberry and coconut mocktail.", image: "strawberry-colada.jpg",
    featured: false, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Cocktail Ginger Mocktail", category: "Mocktails", price: 400, description: "Zesty ginger mocktail.", image: "ginger-mocktail.jpg",
    featured: false, popular: false, vegetarian: true, spicy: false, available: true, preparationTime: 5
  },
  {
    name: "Perfect Design", category: "Mocktails", price: 400, description: "Our signature special mocktail.", image: "perfect-design.jpg",
    featured: true, popular: true, vegetarian: true, spicy: false, available: true, preparationTime: 5
  }
];

export default initialMenuItems;
