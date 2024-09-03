import React, { useState } from 'react';

interface Website {
  id: number;
  name: string;
  url: string;
}

interface Screenshot {
  id: number;
  name: string;
  imagePath: string;
}

const App: React.FC = () => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const websites: Website[] = [
    { id: 1, name: 'iFunded', url: 'https://ifunded.de/en/' },
    { id: 2, name: 'PropertyPartner', url: 'https://www.propertypartner.co' },
  ];

  const fetchScreenshots = () => {
    setLoading(true);

    fetch('http://localhost:3001/screenshots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ websites }),
    })
    .then(response => response.json())
    .then(data => {
      setScreenshots(data);
    })
    .catch(error => {
      console.error('Error fetching screenshots:', error);
    })
    .finally(() => {
      setLoading(false);
      console.log('Screenshots fetched:', screenshots);
    });
  };

  return (
    <div>
      <h1>Website Screenshots</h1>
      <button onClick={fetchScreenshots}>Fetch Screenshots</button>
      {loading ? (
        <p>Loading screenshots...</p>
      ) : (
        <div>
          <p>Done ... {screenshots.length} screenshots fetched. see the console for more details.</p>
        </div>
      )}
    </div>
  );
};

export default App;