import React, { useState } from 'react';
import '../Stylesheets/styles.css';

const Settings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUpdate = () => {
    // Handle profile update logic
  };

  const handleReset = () => {
    // Handle reset logic
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-form">
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button onClick={handleUpdate}>Update</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default Settings;
