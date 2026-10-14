// src/components/home/AIAdvisorBanner.jsx
// Home-page entry point to the AI food advisor.
import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/outline';

const EXAMPLES = ['Diabetes-friendly dinner', 'Food for acidity', 'High-protein lunch', 'Low-calorie meals'];

const AIAdvisorBanner = () => (
  <section className="py-10 sm:py-14">
    <div className="container-custom">
      <div className="flex flex-col gap-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white sm:p-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide">
            <SparklesIcon className="h-4 w-4" /> New · AI Food Advisor
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Food that fits your health</h2>
          <p className="mt-2 text-emerald-50">
            Tell our AI about your health goals or conditions and get dishes from KFT restaurants that suit you, plus a
            personal daily meal plan.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLES.map((e) => (
              <span key={e} className="rounded-full bg-white/15 px-3 py-1 text-xs">{e}</span>
            ))}
          </div>
        </div>
        <Link
          to="/ai-advisor"
          className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 shadow hover:bg-emerald-50"
        >
          <SparklesIcon className="h-5 w-5" /> Try the AI Advisor
        </Link>
      </div>
    </div>
  </section>
);

export default AIAdvisorBanner;
