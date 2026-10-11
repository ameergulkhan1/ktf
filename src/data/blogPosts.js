// src/data/blogPosts.js
// Blog content for the home page teaser, /blog and /blog/:id. There is no CMS or blog API
// in the backend, so posts live here until one is added.

export const blogPosts = [
  {
    id: 1,
    title: '10 Healthy Food Habits to Start Today',
    excerpt: 'Discover simple and effective ways to improve your eating habits for a healthier lifestyle.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    author: 'Dr. Nutrition',
    date: 'Dec 15, 2024',
    category: 'Health',
    body: [
      'Eating well does not have to mean giving up the food you love. Small, consistent changes add up far more than a strict diet you abandon after a week.',
      'Start with water: a glass before each meal helps with portion control. Add a portion of vegetables or salad to lunch and dinner, and swap one fried item a day for something grilled or baked.',
      'Eat slowly and stop when you are comfortably full. Plan meals ahead so you are not ordering on an empty stomach, and keep fruit or nuts at hand for snacks.',
      'Finally, enjoy your desi favourites in balance. A plate of biryani with raita and salad is a better meal than biryani alone, and sharing a dessert halves the sugar without losing the treat.',
    ],
  },
  {
    id: 2,
    title: 'The Best Pizza Places in Town',
    excerpt: 'Explore our top picks for the most delicious and authentic pizza restaurants near you.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    author: 'Food Critic',
    date: 'Dec 12, 2024',
    category: 'Reviews',
    body: [
      'A great pizza starts with the dough: a crust that is crisp at the edge, soft inside and properly charred from a hot oven.',
      'When you browse restaurants on KTF, check ratings and reviews from other customers, and look for places that list their ingredients and oven style.',
      'Our tip: order a simple margherita first. If a kitchen gets the basics right, the rest of the menu is usually worth exploring.',
    ],
  },
  {
    id: 3,
    title: 'Cooking Tips for Beginners',
    excerpt: 'Essential kitchen tips and techniques to help you cook like a pro from day one.',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80',
    author: 'Chef Mike',
    date: 'Dec 10, 2024',
    category: 'Cooking',
    body: [
      'Read the whole recipe before you start, and prepare all your ingredients first. Chopped onions, measured spices and ready tomatoes make cooking calm instead of rushed.',
      'Learn to control heat. Most desi dishes depend on properly browned onions and a well-cooked masala, which takes patience on medium heat rather than speed on high heat.',
      'Taste as you go and season gradually. It is easy to add salt and chilli, and very hard to take them away.',
      'Keep your knives sharp and your workspace clean. Both make cooking safer and more enjoyable.',
    ],
  },
];

export const getBlogPost = (id) => blogPosts.find((post) => String(post.id) === String(id));
