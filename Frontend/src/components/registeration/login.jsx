import React, { useState } from 'react';
import './style.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here (e.g., call an API)
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <>
    <div className="background">
      <div className="shape"></div>
      <div className="shape"></div>
    </div>

    <form onSubmit={handleSubmit}>
      <h3>Login Here</h3>

      <label htmlFor="username">Username</label>
      <input
        type="text"
        placeholder="Email or Phone"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        placeholder="Password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Log In</button>
      <div className="social">
        <div className="go">
          <i className="fab fa-google"></i> Google
        </div>
        <div className="fb">
          <i className="fab fa-facebook"></i> Facebook
        </div>
      </div>
    </form>
    </>
  );
};

export default LoginPage;
