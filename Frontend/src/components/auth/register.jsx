import React, { useState } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';
import './style.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  // Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullname, username, email, password, confirmPassword } = formData;

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(''); 

    try {
      const response = await axios.post('http://localhost:3002/register', {
        fullname,
        username,
        email,
        password
      });
      console.log('Registration successful:', response.data);
      alert('Registration successful!');
      setFormData({ fullname: '', username: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      console.error('Error during registration:', err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <MDBContainer fluid className="p-4 signup-container background-radial-gradient overflow-hidden">
      <MDBRow>
        {/* Left Section */}
        <MDBCol md="6" className="text-center text-md-start d-flex flex-column justify-content-center">
          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
            The best offer <br />
            <span style={{ color: 'hsl(218, 81%, 75%)' }}>for your business</span>
          </h1>
          <p className="px-3" style={{ color: 'hsl(218, 81%, 85%)' }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, itaque accusantium odio,
            soluta, corrupti aliquam quibusdam tempora at cupiditate quis eum maiores libero veritatis?
            Dicta facilis sint aliquid ipsum atque?
          </p>
        </MDBCol>

        {/* Right Section */}
        <MDBCol md="6" className="position-relative">
          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className="my-5 pt-3 bg-glass">
            <MDBCardBody className="p-5">
              <form onSubmit={handleSubmit}>
                {/* Full Name and Username */}
                <MDBRow>
                  <MDBCol col="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Full Name"
                      name="fullname"
                      type="text"
                      value={formData.fullname}
                      onChange={handleChange}
                    />
                  </MDBCol>
                  <MDBCol col="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                {/* Email */}
                <MDBInput
                  wrapperClass="mb-4"
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                {/* Password and Confirm Password */}
                <MDBRow>
                  <MDBCol col="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </MDBCol>
                  <MDBCol col="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                {/* Error Message */}
                {error && <p className="text-danger text-center">{error}</p>}

                {/* Submit Button */}
                <button className="w-100 h-20 btn btn-primary mb-4" size="md" type="submit">
                  Sign Up
                </button>

                {/* Social Media Buttons */}
                <div className="text-center">
                  <p>or sign up with:</p>
                  <MDBBtn tag="a" color="none" className="mx-3" style={{ color: '#1266f1' }}>
                    <MDBIcon fab icon="facebook-f" size="sm" />
                  </MDBBtn>
                  <MDBBtn tag="a" color="none" className="mx-3" style={{ color: '#1266f1' }}>
                    <MDBIcon fab icon="twitter" size="sm" />
                  </MDBBtn>
                  <MDBBtn tag="a" color="none" className="mx-3" style={{ color: '#1266f1' }}>
                    <MDBIcon fab icon="google" size="sm" />
                  </MDBBtn>
                  <MDBBtn tag="a" color="none" className="mx-3" style={{ color: '#1266f1' }}>
                    <MDBIcon fab icon="github" size="sm" />
                  </MDBBtn>
                </div>

                {/* Redirect to Login */}
                <div className="text-center mt-3">
                  <p>
                    Already have an account?{' '}
                    <a href="/login" style={{ color: '#1266f1' }}>
                      Sign in
                    </a>
                  </p>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Register;
