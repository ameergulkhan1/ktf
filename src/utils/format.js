// src/utils/format.js
// One formatter for every amount in the app. Prices are stored and charged in PKR, but the
// UI used to print them with a "$" prefix in most places and "Rs." in a few, so the same
// order could read "$650.00" on the cart and "Rs. 650.00" on the order list.

const toNumber = (value) => {
  const num = parseFloat(value);
  return Number.isFinite(num) ? num : 0;
};

const rupees = new Intl.NumberFormat('en-PK', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

// formatPrice(1250)   -> "Rs. 1,250"
// formatPrice(99.5)   -> "Rs. 99.5"  (paisa only shown when present)
export const formatPrice = (value) => `Rs. ${rupees.format(toNumber(value))}`;

// Negative-safe variant for discounts: formatDiscount(50) -> "-Rs. 50"
export const formatDiscount = (value) => `-${formatPrice(Math.abs(toNumber(value)))}`;

// API numerics arrive as strings ("4.50"), so `rating.toFixed` on the raw value throws.
export const formatRating = (value) => {
  const num = toNumber(value);
  return num > 0 ? num.toFixed(1) : null;
};

export { toNumber };
