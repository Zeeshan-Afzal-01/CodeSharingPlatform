import React, { useState, useRef } from 'react';
import axios from 'axios';
import Modal from "./Modal";

import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const updateAvatar = (imgSrc) => {
    setPreviewImage(imgSrc);
    setFormData(prev => ({ ...prev, profileImage: imgSrc }));
    setModalOpen(false);
  };

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullname, username, email, password, confirmPassword, profileImage } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    const formDataToSend = new FormData();
    formDataToSend.append("fullname", fullname);
    formDataToSend.append("username", username);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    
    // If profileImage is a base64 string, convert it to a file
    if (profileImage && typeof profileImage === 'string') {
      const response = await fetch(profileImage);
      const blob = await response.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

      formDataToSend.append("profileImage", file);
    }

    try {
      formDataToSend.forEach((value, key) => {
        console.log(key, value);
      });
      
      const response = await axios.post("http://localhost:3002/users/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      console.log("Registration successful:", response.data);
      alert("Registration successful!");
      
      navigate("/otp-verify", { state: { email: formData.email } });

    } catch (err) {
      console.error("Error during registration:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <MDBContainer fluid className="p-5 h-100 signup-container background-radial-gradient overflow-hidden">
        {modalOpen && (
                  <Modal
                    updateAvatar={updateAvatar}
                    closeModal={() => setModalOpen(false)}
                  />
                )}

      <MDBRow>
        <MDBCol md="6" className="text-center text-md-start d-flex flex-column justify-content-center">
          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
            The best offer <br />
            <span style={{ color: 'hsl(218, 81%, 75%)' }}>for your business</span>
          </h1>
        </MDBCol>

        <MDBCol md="6" className="position-relative">
          <MDBCard className="my-5 pt-3 bg-glass">
            <MDBCardBody className="p-5">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <MDBRow>
                  <MDBCol col="6">
                    <MDBInput wrapperClass="mb-4" label="Full Name" name="fullname" type="text" value={formData.fullname} onChange={handleChange} required />
                  </MDBCol>
                  <MDBCol col="6">
                    <MDBInput wrapperClass="mb-4" label="Username" name="username" type="text" value={formData.username} onChange={handleChange} required />
                  </MDBCol>
                </MDBRow>

                <MDBInput wrapperClass="mb-4" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />

                <MDBRow>
                  <MDBCol col="6">
                    <MDBInput wrapperClass="mb-4" label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                  </MDBCol>
                  <MDBCol col="6">
                    <MDBInput wrapperClass="mb-4" label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                  </MDBCol>
                </MDBRow>

                <div className="mb-4">
                  <label className="form-label">Upload Profile Image</label>
                  <div className="d-flex flex-column align-items-center">
                    <button 
                      type="button" 
                      className="btn btn-outline-primary w-100 mb-3" 
                      onClick={() => setModalOpen(true)}
                    >
                      <MDBIcon fas icon="camera" className="me-2" />
                      Choose Image
                    </button>
                    {previewImage && (
                      <div className="mt-2 position-relative">
                        <img 
                          src={previewImage} 
                          alt="Profile preview" 
                          style={{ 
                            width: '150px', 
                            height: '150px', 
                            objectFit: 'cover', 
                            borderRadius: '50%',
                            border: '3px solid #1266f1',
                            boxShadow: '0 0 10px rgba(18, 102, 241, 0.3)'
                          }} 
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute"
                          style={{ top: '0', right: '0' }}
                          onClick={() => {
                            setPreviewImage(null);
                            setFormData(prev => ({ ...prev, profileImage: null }));
                          }}
                        >
                          <MDBIcon fas icon="times" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              
                {error && <p className="text-danger text-center">{error}</p>}

                <button className="w-100 h-20 btn btn-primary mb-4" size="md" type="submit">
                  Sign Up
                </button>

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