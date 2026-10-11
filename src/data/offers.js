// src/data/offers.js
// Promotional content shown on the home page and the /offers page.
// NOTE: these are display-only. Checkout does not apply any of these discounts yet;
// a promotions/coupon engine is needed on the backend before they can be honoured.

export const offers = [
  {
    id: 1,
    title: 'Biryani Special',
    description: 'Get 30% off on all Biryani orders this weekend',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    bg: 'from-blue-600 to-indigo-700',
    discount: '30% OFF',
    badge: 'Desi',
    link: '/products?category=Biryani',
  },
  {
    id: 2,
    title: 'BBQ Feast',
    description: 'Buy 2 get 1 free on all BBQ platters',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    bg: 'from-blue-700 to-purple-700',
    discount: 'Buy 2 Get 1',
    badge: '🔥 Hot Deal',
    link: '/products?category=BBQ',
  },
  {
    id: 3,
    title: 'Nihari Night',
    description: 'Free delivery on all Nihari orders above Rs. 15',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
    bg: 'from-indigo-600 to-blue-700',
    discount: 'Free Delivery',
    badge: 'Special',
    link: '/products?category=Nihari',
  },
];
