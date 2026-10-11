// src/pages/info/LegalPage.jsx
// Shared layout for Terms, Privacy and Refund. Sections are { heading, paragraphs[] }.
import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { SITE } from '../../config/site';

const LegalPage = ({ title, intro, sections }) => (
  <>
    <PageHeader title={title} subtitle={`Last updated: ${SITE.legalUpdated}`} />
    <div className="container-custom py-10 sm:py-14">
      <article className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sm:p-10">
        {intro && <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{intro}</p>}
        <nav aria-label="Contents" className="mb-8 rounded-xl bg-gray-50 dark:bg-gray-700/40 p-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Contents</p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-600 dark:text-blue-400">
            {sections.map((section, i) => (
              <li key={section.heading}>
                <a href={`#section-${i + 1}`} className="hover:underline">
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="space-y-8">
          {sections.map((section, i) => (
            <section key={section.heading} id={`section-${i + 1}`} className="scroll-mt-24">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                {i + 1}. {section.heading}
              </h2>
              <div className="space-y-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                {section.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          Questions about this policy? Email{' '}
          <a href={`mailto:${SITE.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            {SITE.email}
          </a>{' '}
          or visit our <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact page</Link>.
        </div>
      </article>
    </div>
  </>
);

export default LegalPage;
