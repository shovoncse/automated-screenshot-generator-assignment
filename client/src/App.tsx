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
  const [error, setError] = useState<string | null>(null);

  const websites: Website[] = [
    { id: 1, name: 'iFunded', url: 'https://ifunded.de/en/' },
    { id: 2, name: 'PropertyPartner', url: 'https://www.propertypartner.co' },
  ];

  const fetchScreenshots = async () => {
    setLoading(true);
    setError(null); 

    try {
      const response = await fetch('http://localhost:3001/screenshots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websites }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: Screenshot[] = await response.json();
      setScreenshots(data);
    } catch (error: any) {
      console.error('Error fetching screenshots:', error);
      setError('Failed to fetch screenshots. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Website Screenshots</h1>
      <button onClick={fetchScreenshots} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Screenshots'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {screenshots.length > 0 && !loading && (
        <div>
          <p>Fetched {screenshots.length} screenshots:</p>
          {screenshots.map((screenshot) => (
            <div key={screenshot.id}>
              <h2>{screenshot.name}</h2>
              <img
                src={screenshot.imagePath}
                alt={screenshot.name}
                style={{ width: '100%', maxWidth: '600px' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;