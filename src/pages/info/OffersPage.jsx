// src/pages/info/OffersPage.jsx
import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import { OfferCard } from '../../components/home/SpecialOffers';
import { offers } from '../../data/offers';

const OffersPage = () => (
  <>
    <PageHeader title="Special Offers" subtitle="Current deals on your favourite desi food." />
    <div className="container-custom py-10 sm:py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {offers.map((offer, index) => (
          <OfferCard key={offer.id} offer={offer} index={index} />
        ))}
      </div>
    </div>
  </>
);

export default OffersPage;
