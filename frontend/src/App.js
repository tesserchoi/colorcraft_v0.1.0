import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    brandName: '',
    brandOverview: '',
    industry: '',
    targetAudience: '',
    mission: '',
    personality: '',
    stylePreferences: ''
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      setResult('Error generating color palette.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>Brand Color Palette Generator</h1>
      <form onSubmit={handleSubmit}>
        {[
          ['Brand Name', 'brandName'],
          ['Brand Overview', 'brandOverview'],
          ['Industry or Business Type', 'industry'],
          ['Target Audience', 'targetAudience'],
          ['Brand Mission or Core Values', 'mission'],
        ].map(([label, name]) => (
          <div key={name}>
            <label>{label}:</label><br />
            <input type="text" name={name} value={formData[name]} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
          </div>
        ))}

        <div>
          <label>Brand Personality / Tone:</label><br />
          <select name="personality" value={formData.personality} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }}>
            <option value="">Select a personality</option>
            <option value="Sincere / Friendly / Down-to-Earth">Sincere / Friendly / Down-to-Earth</option>
            <option value="Exciting / Energetic / Youthful">Exciting / Energetic / Youthful</option>
            <option value="Sophisticated / Luxurious / Elegant">Sophisticated / Luxurious / Elegant</option>
            <option value="Competent / Professional / Reliable">Competent / Professional / Reliable</option>
            <option value="Playful / Whimsical / Creative">Playful / Whimsical / Creative</option>
          </select>
        </div>

        <div>
          <label>Style Preferences (Optional):</label><br />
          <input type="text" name="stylePreferences" value={formData.stylePreferences} onChange={handleChange} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: '#FFF', border: 'none', borderRadius: '4px' }}>
          {loading ? 'Generating...' : 'Generate Color Palette'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc' }}>
          <h2>Generated Color Palette:</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
