// src/pages/info/RefundPage.jsx
// Draft refund policy. Adjust the windows and rules to the business's actual policy.
import React from 'react';
import LegalPage from './LegalPage';
import { SITE } from '../../config/site';

const sections = [
  {
    heading: 'Cancelling an order',
    paragraphs: [
      'You can cancel an order from My Orders while it is still pending. Once the restaurant has started preparing it, cancellation may no longer be possible.',
      'Cash on delivery orders cancelled before delivery are not charged.',
    ],
  },
  {
    heading: 'Problems with your order',
    paragraphs: [
      'If items are missing, incorrect, or the food is not of acceptable quality, contact us within 24 hours of delivery with your order number and, where possible, a photo.',
      'We will review the issue with the vendor and may offer a replacement, a partial refund or a full refund depending on the circumstances.',
    ],
  },
  {
    heading: 'How refunds are paid',
    paragraphs: [
      'For cash on delivery orders, approved refunds are paid by bank transfer or mobile wallet to an account you nominate.',
      'Where online payments are introduced, refunds will be returned to the original payment method.',
    ],
  },
  {
    heading: 'Non-refundable cases',
    paragraphs: [
      'Refunds are not normally given for a change of mind after the food has been prepared, or where delivery failed because the address or phone number provided was incorrect.',
    ],
  },
  {
    heading: 'Contact',
    paragraphs: [`For refund requests, email ${SITE.email} or call ${SITE.phone}.`],
  },
];

const RefundPage = () => (
  <LegalPage
    title="Refund Policy"
    intro="We want every order to arrive right. If it does not, here is how cancellations and refunds work."
    sections={sections}
  />
);

export default RefundPage;
