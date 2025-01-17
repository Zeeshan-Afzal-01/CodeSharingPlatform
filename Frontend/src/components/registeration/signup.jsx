import React, { useState } from 'react';
import './style.css';

const SignUpPage = () => {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here (e.g., call an API)
    console.log('Full Name:', fullname);
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <>
    <div className="background">
      <div className="shape"></div>
      <div className="shape"></div>
    </div>

    <form onSubmit={handleSubmit}>
      <h3>Sign Up Here</h3>

      <label htmlFor="fullname">Full Name</label>
      <input
        type="text"
        placeholder="Full Name"
        id="fullname"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
      />

      <label htmlFor="username">Username</label>
      <input
        type="text"
        placeholder="Username"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="email">Email</label>
      <input
        type="email"
        placeholder="Email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        placeholder="Password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Sign Up</button>
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

export default SignUpPage;
