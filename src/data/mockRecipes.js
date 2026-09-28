/**
 * Curated showcase recipes for design system verification & fallback
 * Every recipe strictly pairs its official idMeal, strMeal, and strMealThumb.
 * No generic or mismatched food photos.
 */

import { GHANAIAN_RECIPES } from './ghanaianRecipes.js';

export const MOCK_CATEGORIES = [
  { idCategory: 'gh', strCategory: 'Ghanaian' },
  { idCategory: '1', strCategory: 'Seafood' },
  { idCategory: '2', strCategory: 'Chicken' },
  { idCategory: '3', strCategory: 'Pasta' },
  { idCategory: '4', strCategory: 'Vegetarian' },
  { idCategory: '5', strCategory: 'Beef' },
  { idCategory: '6', strCategory: 'Dessert' },
];

export const MOCK_RECIPES = [
  ...GHANAIAN_RECIPES,
  {
    idMeal: '52820',
    strMeal: 'Katsu Chicken curry',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/vwrpps1503068729.jpg',
    strCategory: 'Chicken',
    strArea: 'Japanese',
    prepTime: '35 min',
    difficulty: 'Moderate',
    servings: '4 Servings',
    description: 'Crispy panko-breaded chicken cutlets served with a rich, spiced Japanese golden curry sauce and steamed rice.',
    strInstructions: `1. Place the chicken breasts between sheets of cling film and pound gently with a rolling pin until even in thickness.
2. Season chicken with salt and pepper. Dust with flour, dip into beaten egg, and coat thoroughly with panko breadcrumbs.
3. Heat vegetable oil in a deep skillet over medium heat. Fry chicken cutlets for 4-5 minutes per side until deeply golden and crispy. Transfer to a paper towel-lined rack.
4. In a separate saucepan, sweat diced onions, grated ginger, and garlic in a splash of oil. Stir in curry powder and flour, cooking for 1 minute.
5. Slowly whisk in chicken broth and soy sauce. Simmer gently until the curry sauce thickens to a glossy consistency.
6. Slice the crispy katsu chicken into strips, ladle warm curry sauce over top, and serve with fluffy steamed jasmine rice.`,
    strIngredient1: 'Chicken Breast',
    strMeasure1: '4',
    strIngredient2: 'Plain Flour',
    strMeasure2: '100g',
    strIngredient3: 'Egg',
    strMeasure3: '1',
    strIngredient4: 'Panko Breadcrumbs',
    strMeasure4: '100g',
    strIngredient5: 'Vegetable Oil',
    strMeasure5: 'For frying',
    strIngredient6: 'Onions',
    strMeasure6: '1 large',
    strIngredient7: 'Curry Powder',
    strMeasure7: '2 tbsp',
    strIngredient8: 'Chicken Stock',
    strMeasure8: '600ml',
    strIngredient9: 'Soy Sauce',
    strMeasure9: '1 tbsp',
    strYoutube: 'https://www.youtube.com/watch?v=2kG6oQ9T6v8',
  },
  {
    idMeal: '52982',
    strMeal: 'Spaghetti alla Carbonara',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg',
    strCategory: 'Pasta',
    strArea: 'Italian',
    prepTime: '20 min',
    difficulty: 'Easy',
    servings: '4 Servings',
    description: 'Classic Roman spaghetti tossed with crispy guanciale, rich egg yolks, aged Pecorino Romano, and coarse black pepper.',
    strInstructions: `1. Bring a large pot of salted water to a rolling boil. Add spaghetti and cook until al dente.
2. While pasta cooks, dice guanciale or pancetta into thick matchsticks. Fry in a wide skillet over medium heat until crispy and fat has rendered. Remove from heat.
3. In a bowl, whisk together egg yolks, whole egg, freshly grated Pecorino Romano, and generous freshly cracked black pepper until thick and creamy.
4. Transfer hot pasta directly into the skillet with the rendered pork fat, tossing to coat.
5. Off the heat, pour the egg and cheese mixture over the pasta, adding a ladle of starchy pasta water. Toss vigorously until a glossy, velvety emulsion forms.
6. Serve immediately garnished with extra Pecorino and cracked black pepper.`,
    strIngredient1: 'Spaghetti',
    strMeasure1: '400g',
    strIngredient2: 'Guanciale',
    strMeasure2: '150g',
    strIngredient3: 'Egg Yolks',
    strMeasure3: '4 large',
    strIngredient4: 'Pecorino Romano',
    strMeasure4: '80g grated',
    strIngredient5: 'Black Pepper',
    strMeasure5: 'Freshly cracked',
    strYoutube: 'https://www.youtube.com/watch?v=3AAdKl1UYZs',
  },
  {
    idMeal: '52834',
    strMeal: 'Beef stroganoff',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/svprys1511176755.jpg',
    strCategory: 'Beef',
    strArea: 'Russian',
    prepTime: '30 min',
    difficulty: 'Moderate',
    servings: '4 Servings',
    description: 'Tender strips of prime beef seared with sliced cremini mushrooms and shallots in a rich Dijon sour cream sauce.',
    strInstructions: `1. Slice beef fillet or sirloin into thin strips. Season well with sea salt and cracked black pepper.
2. Heat butter and olive oil in a heavy frying pan over high heat. Sear beef strips in batches for 1-2 minutes until browned on the outside but still pink inside. Remove and set aside.
3. In the same pan, melt another knob of butter and fry sliced onions and mushrooms until tender and golden.
4. Stir in Dijon mustard, paprika, and beef broth, simmering for 2 minutes to reduce slightly.
5. Reduce heat to low and stir in sour cream (or crème fraîche) until smooth and creamy.
6. Return the beef and resting juices to the pan and warm gently for 1 minute without letting the sauce boil. Serve over buttered egg noodles or mashed potatoes.`,
    strIngredient1: 'Beef Fillet',
    strMeasure1: '500g',
    strIngredient2: 'Butter',
    strMeasure2: '40g',
    strIngredient3: 'Onion',
    strMeasure3: '1 chopped',
    strIngredient4: 'Mushrooms',
    strMeasure4: '250g sliced',
    strIngredient5: 'Dijon Mustard',
    strMeasure5: '1 tbsp',
    strIngredient6: 'Sour Cream',
    strMeasure6: '150g',
    strIngredient7: 'Beef Stock',
    strMeasure7: '100ml',
    strYoutube: 'https://www.youtube.com/watch?v=RO3uN4J-Zz8',
  },
  {
    idMeal: '52772',
    strMeal: 'Teriyaki Chicken Casserole',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
    strCategory: 'Chicken',
    strArea: 'Japanese',
    prepTime: '45 min',
    difficulty: 'Easy',
    servings: '6 Servings',
    description: 'Shredded chicken baked with wholesome brown rice, tender stir-fry vegetables, and a sweet soy-ginger teriyaki glaze.',
    strInstructions: `1. Preheat oven to 175°C (350°F). Lightly grease a baking dish.
2. In a small saucepan, combine soy sauce, water, brown sugar, minced ginger, and garlic over medium heat. Whisk cornstarch with water and stir into sauce until thickened into a glossy glaze.
3. Season chicken breasts with half the teriyaki glaze and bake for 35 minutes until cooked through. Shred into bite-sized pieces with forks.
4. Toss shredded chicken with cooked brown rice, steamed stir-fry vegetables, and remaining teriyaki sauce in the baking dish.
5. Bake for an additional 15 minutes to allow flavors to meld. Garnish with toasted sesame seeds before serving.`,
    strIngredient1: 'Chicken Breasts',
    strMeasure1: '2 large',
    strIngredient2: 'Soy Sauce',
    strMeasure2: '3/4 cup',
    strIngredient3: 'Brown Sugar',
    strMeasure3: '1/4 cup',
    strIngredient4: 'Ginger & Garlic',
    strMeasure4: '1/2 tsp each',
    strIngredient5: 'Cornstarch',
    strMeasure5: '2 tbsp',
    strIngredient6: 'Brown Rice',
    strMeasure6: '3 cups cooked',
    strIngredient7: 'Stir-fry Vegetables',
    strMeasure7: '350g',
    strYoutube: 'https://www.youtube.com/watch?v=4aZr5hZXP_s',
  },
  {
    idMeal: '52959',
    strMeal: 'Baked salmon with fennel & tomatoes',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/1548772327.jpg',
    strCategory: 'Seafood',
    strArea: 'British',
    prepTime: '25 min',
    difficulty: 'Easy',
    servings: '2 Servings',
    description: 'Tender fresh salmon filets nestled among caramelized fennel wedges, sweet cherry tomatoes, and aromatic parsley.',
    strInstructions: `1. Preheat oven to 180°C (350°F). Trim fennel bulbs into wedges and parboil in salted water for 10 minutes; drain thoroughly.
2. Spread the drained fennel wedges and cherry tomatoes over a shallow baking dish, drizzling generously with olive oil and sea salt. Bake for 10 minutes.
3. Nestle salmon filets among the vegetables, sprinkle with fresh lemon juice, and season with black pepper.
4. Bake for 15 minutes more until the salmon flakes easily with a fork. Scatter with chopped fresh parsley and lemon zest to serve.`,
    strIngredient1: 'Salmon Filets',
    strMeasure1: '2 fresh pieces (350g)',
    strIngredient2: 'Fennel',
    strMeasure2: '2 medium bulbs',
    strIngredient3: 'Cherry Tomatoes',
    strMeasure3: '175g',
    strIngredient4: 'Olive Oil',
    strMeasure4: '1 tbsp',
    strIngredient5: 'Lemon',
    strMeasure5: 'Juice and zest',
    strIngredient6: 'Fresh Parsley',
    strMeasure6: '2 tbsp chopped',
    strYoutube: 'https://www.youtube.com/watch?v=xvPR2Tfw5k0',
  },
  {
    idMeal: '52777',
    strMeal: 'Mediterranean Pasta Salad',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wvqpwt1468339226.jpg',
    strCategory: 'Pasta',
    strArea: 'Italian',
    prepTime: '20 min',
    difficulty: 'Easy',
    servings: '4 Servings',
    description: 'Bowtie farfalle pasta tossed with ripe cherry tomatoes, mini mozzarella balls, tender tuna, green olives, and fresh basil.',
    strInstructions: `1. Cook farfalle pasta in salted boiling water until al dente. Drain and rinse under cold water to stop cooking.
2. In a large salad bowl, combine halved cherry tomatoes, torn sweet basil leaves, pitted green olives, and drained mozzarella pearls.
3. Flake tender tuna into the bowl and add the cooled pasta.
4. Drizzle with extra virgin olive oil, freshly ground black pepper, and sea salt.
5. Toss gently to combine and chill for 20 minutes before serving to let the Mediterranean flavors infuse.`,
    strIngredient1: 'Farfalle Pasta',
    strMeasure1: '350g',
    strIngredient2: 'Mozzarella Pearls',
    strMeasure2: '200g',
    strIngredient3: 'Cherry Tomatoes',
    strMeasure3: '250g halved',
    strIngredient4: 'Tuna',
    strMeasure4: '200g in olive oil',
    strIngredient5: 'Green Olives',
    strMeasure5: '40g sliced',
    strIngredient6: 'Extra Virgin Olive Oil',
    strMeasure6: '3 tbsp',
    strIngredient7: 'Fresh Basil',
    strMeasure7: '1 bunch torn',
    strYoutube: 'https://www.youtube.com/watch?v=e52IL8zYmaE',
  },
];
