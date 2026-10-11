// src/pages/info/TermsPage.jsx
// Draft terms written to match how the platform currently works. Have them reviewed by a
// lawyer before relying on them.
import React from 'react';
import LegalPage from './LegalPage';
import { SITE } from '../../config/site';

const sections = [
  {
    heading: 'About these terms',
    paragraphs: [
      `These terms govern your use of ${SITE.fullName} (the "Platform") at ${SITE.domain}. By creating an account or placing an order you agree to them.`,
      'The Platform connects customers with independent restaurants and food vendors ("Vendors"). Vendors prepare and are responsible for the food they list.',
    ],
  },
  {
    heading: 'Accounts',
    paragraphs: [
      'You must provide accurate details when registering and keep your password confidential. You are responsible for activity on your account.',
      'We may suspend or close accounts that are used for fraud, abuse, or in breach of these terms.',
    ],
  },
  {
    heading: 'Orders and pricing',
    paragraphs: [
      'Prices are shown in Pakistani Rupees (PKR) and are set by Vendors. The total shown at checkout, including any delivery fee and tax, is the amount payable for your order.',
      'An order is confirmed once the Vendor accepts it. Vendors may decline or cancel an order, for example if an item is unavailable; you will not be charged for an order that is cancelled before delivery.',
      'Promotional offers apply only where stated at checkout.',
    ],
  },
  {
    heading: 'Payment',
    paragraphs: [
      'Cash on delivery is currently the available payment method. Please have the exact amount ready where possible.',
      'Where online payment options are introduced, they will be processed by a licensed payment provider and additional terms may apply.',
    ],
  },
  {
    heading: 'Delivery',
    paragraphs: [
      'Delivery times shown are estimates and can vary with traffic, weather and order volume.',
      'Please make sure your address and phone number are correct. If the rider cannot reach you, the order may be cancelled.',
    ],
  },
  {
    heading: 'Cancellations and refunds',
    paragraphs: ['Cancellations and refunds are handled as described in our Refund Policy.'],
  },
  {
    heading: 'Vendor responsibilities',
    paragraphs: [
      'Vendors must hold any licences required for preparing and selling food, list accurate prices, ingredients and allergen information, and fulfil accepted orders.',
      'Vendor accounts and listings are subject to approval and may be suspended for quality or compliance issues.',
    ],
  },
  {
    heading: 'Acceptable use',
    paragraphs: [
      'Do not misuse the Platform, attempt to access other accounts, post false reviews, or interfere with its operation.',
    ],
  },
  {
    heading: 'Liability',
    paragraphs: [
      'To the extent permitted by law, the Platform is not liable for indirect losses. Nothing in these terms limits rights you have under the consumer protection laws of Pakistan.',
    ],
  },
  {
    heading: 'Changes',
    paragraphs: [
      'We may update these terms from time to time. The date at the top of this page shows when they last changed.',
    ],
  },
];

const TermsPage = () => (
  <LegalPage
    title="Terms of Service"
    intro="Please read these terms carefully. They explain how ordering on our platform works and what we expect from customers and vendors."
    sections={sections}
  />
);

export default TermsPage;
