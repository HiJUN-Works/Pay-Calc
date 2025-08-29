import React from 'react';
import './Version.css';

const Version = () => {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = String(now.getMonth() + 1).padStart(2, '0');
  const version = 'v2025.09';

  return (
    <div className="version-display">
      {version}
    </div>
  );
};

export default Version;