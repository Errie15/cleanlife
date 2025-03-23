import { useState, useEffect } from 'react';

// Simple hook that returns sample data without making API calls
const useApi = (endpoint, sampleData) => {
  const [data, setData] = useState(sampleData || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ingen API-anropsfunktionalitet behövs längre
    console.log(`Mock API för ${endpoint} använder sample data`);
  }, [endpoint]);

  return [data, setData, loading, error];
};

export default useApi; 