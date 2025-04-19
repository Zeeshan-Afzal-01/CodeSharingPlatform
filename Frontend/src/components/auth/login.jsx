import React, { useState, useContext } from "react";
import axios from "axios";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBIcon } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import "./style.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext); // Use login from AuthContext
  const navigate = useNavigate();

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const response = await axios.post("http://localhost:3002/users/login", {
        username,
        password,
      });
  
      console.log("Login Response:", response.data); // Debugging
  
      const { token } = response.data;
      
      if (!token) {
        throw new Error("No token received from server");
      }
  
      login( token); 
      navigate("/dashboard");
      
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer
fluid
className="p-4 signup-container background-radial-gradient overflow-hidden"
>
<MDBRow>
  {/* Left Section */}
  <MDBCol
    md="6"
    className="text-center text-md-start d-flex flex-column justify-content-center"
  >
    <h1
      className="my-5 display-3 fw-bold ls-tight px-3"
      style={{ color: "hsl(218, 81%, 95%)" }}
    >
      Welcome Back! <br />
      <span style={{ color: "hsl(218, 81%, 75%)" }}>
        Please log in to your account
      </span>
    </h1>
    <p className="px-3" style={{ color: "hsl(218, 81%, 85%)" }}>
      Access your personalized dashboard, explore features, and manage your account effortlessly.
    </p>
  </MDBCol>

  {/* Right Section */}
  <MDBCol md="6" className="position-relative">
    <div
      id="radius-shape-1"
      className="position-absolute rounded-circle shadow-5-strong"
    ></div>
    <div
      id="radius-shape-2"
      className="position-absolute shadow-5-strong"
    ></div>

    <MDBCard className="my-5 pt-5 bg-glass">
      <MDBCardBody className="p-5 login-field">
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <MDBInput
            wrapperClass="mb-4"
            label="Username"
            id="form3"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            required
          />
          {/* Password Field */}
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="form4"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />

          {/* Error Message */}
          {error && <p className="text-danger text-center">{error}</p>}

          {/* Submit Button */}
          <button
            className="w-100 h-20 btn btn-primary mb-4"
            size="md"
            type="submit"
            disabled={loading} // Disable button during loading
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Social Media Buttons */}
          <div className="text-center">
            <p>or sign in with:</p>

            <MDBBtn
              tag="a"
              color="none"
              className="mx-3"
              style={{ color: "#1266f1" }}
            >
              <MDBIcon fab icon="facebook-f" size="sm" />
            </MDBBtn>

            <MDBBtn
              tag="a"
              color="none"
              className="mx-3"
              style={{ color: "#1266f1" }}
            >
              <MDBIcon fab icon="twitter" size="sm" />
            </MDBBtn>

            <MDBBtn
              tag="a"
              color="none"
              className="mx-3"
              style={{ color: "#1266f1" }}
            >
              <MDBIcon fab icon="google" size="sm" />
            </MDBBtn>

            <MDBBtn
              tag="a"
              color="none"
              className="mx-3"
              style={{ color: "#1266f1" }}
            >
              <MDBIcon fab icon="github" size="sm" />
            </MDBBtn>
          </div>

          {/* Register Link */}
          <div className="text-center mt-3">
            <p>
              Don't have an account?{" "}
              <a
                href="/register"
                style={{
                  color: "#1266f1",
                  textDecoration: "underline",
                }}
              >
                Register here
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

export default Login;






