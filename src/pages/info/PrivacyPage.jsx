// src/pages/info/PrivacyPage.jsx
// Draft privacy policy describing the data the application actually collects today.
// Have it reviewed before relying on it.
import React from 'react';
import LegalPage from './LegalPage';
import { SITE } from '../../config/site';

const sections = [
  {
    heading: 'Information we collect',
    paragraphs: [
      'Account details: your name, email address and password (stored only as a secure hash).',
      'Order details: delivery address, phone number, delivery instructions, the items you order and your order history.',
      'Vendor details: business name, contact details, restaurant information and menu content.',
      'Technical data: basic request logs (such as IP address and pages requested) kept to operate and secure the service.',
    ],
  },
  {
    heading: 'How we use it',
    paragraphs: [
      'To create and manage your account, process and deliver your orders, and let vendors prepare them.',
      'To provide customer support, prevent fraud and abuse, and improve the Platform.',
    ],
  },
  {
    heading: 'Sharing',
    paragraphs: [
      'We share the details needed to fulfil an order (your name, phone number, address and items) with the vendor preparing it and with the person delivering it.',
      'We do not sell your personal information. We may disclose information where required by law.',
    ],
  },
  {
    heading: 'Browser storage',
    paragraphs: [
      'We store a login token and your theme preference in your browser so you stay signed in. Logging out removes the login token.',
    ],
  },
  {
    heading: 'Retention',
    paragraphs: [
      'We keep account and order records for as long as your account is active and as needed for accounting and legal obligations.',
    ],
  },
  {
    heading: 'Your choices',
    paragraphs: [
      `You can update your profile details at any time. To request a copy or deletion of your data, contact ${SITE.email}.`,
    ],
  },
  {
    heading: 'Security',
    paragraphs: [
      'Connections to the Platform are encrypted (HTTPS) and passwords are hashed. No system is perfectly secure, so please use a strong, unique password.',
    ],
  },
  {
    heading: 'Changes',
    paragraphs: ['We will update the date at the top of this page when this policy changes.'],
  },
];

const PrivacyPage = () => (
  <LegalPage
    title="Privacy Policy"
    intro={`This policy explains what personal information ${SITE.fullName} collects, why, and how it is handled.`}
    sections={sections}
  />
);

export default PrivacyPage;
