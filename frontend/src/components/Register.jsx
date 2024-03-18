// RegisterForm.js
import React, { useState, useRef } from 'react';
import './register.css'; // Import CSS for styling

const Register = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // State for success and error messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Refs for input fields
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8800/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        // If response is not OK (status code not in the range 200-299), throw an error
        throw new Error('Failed to register. Please try again.');
      }
  
      // Assuming successful registration
      setSuccessMessage('Registration successful!');
      // Reset form after submission
      setFormData({ username: '', email: '', password: '' });
    } catch (error) {
      // Handle the error
      console.error('Error:', error.message);
      setErrorMessage('Registration failed. Please try again.');
    }
  };
  

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Welcome User</h2>
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            ref={nameRef}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            ref={emailRef}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            ref={passwordRef}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="register-button">Register</button>
        </div>
      </form>
      {successMessage && <span className="success">{successMessage}</span>}
      {errorMessage && <span className="error">{errorMessage}</span>}
    </div>
  );
};

export default Register;
