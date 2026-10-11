// src/pages/info/FaqPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import { FiChevronDown } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import { SITE } from '../../config/site';

const groups = [
  {
    title: 'Ordering',
    items: [
      ['How do I place an order?', 'Browse restaurants or products, add items to your cart, then go to checkout, enter your delivery address and phone number and place the order.'],
      ['Do I need an account?', 'Yes. You can browse without one, but you need a free customer account to add items to your cart and order.'],
      ['How do I track my order?', 'Open My Orders from the menu. Each order shows its current status: pending, processing, shipped or delivered.'],
      ['Can I cancel my order?', 'Yes, while it is still pending. Open the order in My Orders and choose Cancel Order. See our Refund Policy for details.'],
    ],
  },
  {
    title: 'Payment',
    items: [
      ['How can I pay?', 'Cash on delivery is currently available. Please keep the exact amount ready where possible.'],
      ['Which currency are prices in?', 'All prices are in Pakistani Rupees (Rs.). The total you see at checkout is the amount you pay.'],
    ],
  },
  {
    title: 'For vendors',
    items: [
      ['How do I become a vendor?', 'Create a vendor account from the Become a Vendor page. Our team reviews new vendors before their restaurant goes live.'],
      ['How do I add my menu?', 'From your Vendor Dashboard, set up your restaurant, then add products or menu items. New products appear on the site after admin approval.'],
      ['How do I see my earnings?', 'The Earnings page in your Vendor Dashboard shows your sales, commission and payouts.'],
    ],
  },
];

const FaqPage = () => (
  <>
    <PageHeader title="Frequently asked questions" subtitle="Quick answers about ordering, payment and selling on our platform." />
    <div className="container-custom py-10 sm:py-14">
      <div className="max-w-3xl mx-auto space-y-10">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{group.title}</h2>
            <div className="space-y-3">
              {group.items.map(([question, answer]) => (
                <Disclosure key={question} as="div" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium text-gray-900 dark:text-white">
                        <span>{question}</span>
                        <FiChevronDown className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-5 pb-4 text-gray-600 dark:text-gray-300 leading-relaxed">{answer}</Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          </section>
        ))}
        <p className="text-center text-gray-500 dark:text-gray-400">
          Still have a question? <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact us</Link> or email{' '}
          <a href={`mailto:${SITE.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{SITE.email}</a>.
        </p>
      </div>
    </div>
  </>
);

export default FaqPage;
