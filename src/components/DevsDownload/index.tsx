import React, { useState } from 'react';

const DevsDownloadCard = ({ DevsName, code }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = () => {
    console.log("download", code)
    setIsDownloading(true);
    // simulate progress
    const interval = setInterval(() => {
      setDownloadProgress(oldProgress => {
        if (oldProgress === 100) {
          clearInterval(interval);
          setIsDownloading(false);
          return 100;
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 1000);
  };

  return (
    <div className="Devs-download-card">
      <h3>{DevsName}</h3>
      <button onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? 'Downloading...' : 'Download Script'}
      </button>
      {isDownloading && <p>Progress: {downloadProgress}%</p>}
    </div>
  );
};

export default DevsDownloadCard;
