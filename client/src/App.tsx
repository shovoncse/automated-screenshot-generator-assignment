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
    setStatus('Processing...');
    for (const website of websites) {
      try {
        const response = await fetch('http://localhost:5000/api/screenshots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: website.url, filename: `${website.id}_${website.name}` })
        });

        const result = await response.json();

        if (response.ok) {
          setStatus(`Uploaded ${website.name} successfully. Google Drive File ID: ${result.fileId}`);
        } else {
          throw new Error(result.error || 'Failed to upload screenshot');
        }
      } catch (error: any) {
        setStatus(`Error: ${error.message}`);
      }
    }
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