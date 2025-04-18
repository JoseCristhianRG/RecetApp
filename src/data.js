export const recipes = [
  {
    id: '1',
    name: 'Spaghetti Bolognese',
    category: 'Italian',
    ingredients: ['Spaghetti', 'Minced meat', 'Tomato sauce', 'Onion', 'Garlic'],
    instructions: 'Cook spaghetti. Prepare sauce. Mix together.'
  },
  {
    id: '2',
    name: 'Tacos',
    category: 'Mexican',
    ingredients: ['Tortillas', 'Beef', 'Lettuce', 'Cheese', 'Salsa'],
    instructions: 'Prepare beef. Warm tortillas. Assemble tacos.'
  },
  {
    id: '3',
    name: 'Sushi',
    category: 'Japanese',
    ingredients: ['Rice', 'Nori', 'Fish', 'Wasabi'],
    instructions: 'Prepare rice. Assemble sushi rolls.'
  }
];

export const categories = [...new Set(recipes.map((r) => r.category))];