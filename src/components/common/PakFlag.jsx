// src/components/common/PakFlag.jsx
// Windows has no flag emoji glyphs, so the 🇵🇰 used across the UI rendered as the two
// letters "PK" for most desktop visitors. This draws the flag instead.
import React from 'react';

const PakFlag = ({ className = 'h-3 w-auto', title = 'Pakistan' }) => (
  <svg viewBox="0 0 30 20" className={className} role="img" aria-label={title}>
    <rect width="30" height="20" fill="#fff" />
    <rect x="7.5" width="22.5" height="20" fill="#01411C" />
    <circle cx="19.5" cy="10" r="5.5" fill="#fff" />
    <circle cx="20.9" cy="8.8" r="4.9" fill="#01411C" />
    <polygon
      fill="#fff"
      points="23.6,6.2 24.1,7.6 25.6,7.6 24.4,8.5 24.8,9.9 23.6,9.1 22.4,9.9 22.8,8.5 21.6,7.6 23.1,7.6"
    />
  </svg>
);

export default PakFlag;
