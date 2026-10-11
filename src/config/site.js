// src/config/site.js
// Business details shown in the footer, Contact page and legal pages. They were hardcoded
// in the footer; keeping them here means the real values only need to be entered once.
// TODO(owner): replace the placeholder address/phone/email and social links with the real ones.

export const SITE = {
  name: 'KTF',
  fullName: 'KTF Delivery',
  tagline: 'Authentic Pakistani food, delivered.',
  domain: 'kft.com.pk',
  address: '123 Food Street, Lahore, Pakistan',
  phone: '+92 300 1234567',
  email: 'info@ktf.pk',
  hours: 'Mon-Sun: 10:00 AM - 11:00 PM',
  // Leave a link empty to hide its icon in the footer.
  social: {
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
  },
  legalUpdated: 'October 2026',
};

// Pricing rules shared by the cart summary and checkout, so the total a customer sees
// is the total that is posted to /api/orders.
export const PRICING = {
  deliveryFee: 5,
  freeDeliveryThreshold: 50,
  taxRate: 0.1,
};

export const calculateTotals = (subtotal) => {
  const deliveryFee = subtotal > PRICING.freeDeliveryThreshold ? 0 : PRICING.deliveryFee;
  const tax = subtotal * PRICING.taxRate;
  return { subtotal, deliveryFee, tax, total: subtotal + deliveryFee + tax };
};
