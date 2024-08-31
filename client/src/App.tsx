import React, { useState } from 'react';

interface Website {
  id: number;
  name: string;
  url: string;
}

const websites: Website[] = [
  { id: 1, name: 'iFunded', url: 'https://ifunded.de/en/' },
  { id: 2, name: 'PropertyPartner', url: 'https://www.propertypartner.co' },
  { id: 3, name: 'PropertyMoose', url: 'https://propertymoose.co.uk' },
  { id: 4, name: 'Homegrown', url: 'https://www.homegrown.co.uk' },
  { id: 5, name: 'RealtyMogul', url: 'https://www.realtymogul.com' },
];

const App: React.FC = () => {
  const [status, setStatus] = useState<string>('');

  const handleCaptureAndUpload = async () => {
    console.log('Capture and Upload Screenshots');
  };

  return (
    <div className="App">
      <h1>Screenshot Tool</h1>
      <button onClick={handleCaptureAndUpload}>Capture and Upload Screenshots</button>
      <p>{status}</p>
    </div>
  );
};

export default App;