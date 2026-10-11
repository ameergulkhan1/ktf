// src/components/common/PageHeader.jsx
import React from 'react';

const PageHeader = ({ title, subtitle, children }) => (
  <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white">
    <div className="container-custom py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-3 max-w-2xl text-white/85 text-base sm:text-lg">{subtitle}</p>}
      {children}
    </div>
  </section>
);

export default PageHeader;
