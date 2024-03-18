import React, { useRef } from 'react';
import './login.css'; // Import CSS for styling

const Login = ({ onClose }) => { // Pass onClose function as props
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: emailRef.current.value,
      password: passwordRef.current.value
    };
  
    try {
      const response = await fetch('http://localhost:8800/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to login. Please try again.');
      }
  
      // Parse response data
      const userData = await response.json();
  
      // Save user data to localStorage
      localStorage.setItem('userId', userData.id);
      console.log(userData.username)
      localStorage.setItem('username', userData.username);
  
      // Reset form after successful submission
      emailRef.current.value = '';
      passwordRef.current.value = '';
      onClose(); // Close the login form after successful login
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  
  

  return (
    <div className="container">
      <button className="close-button" onClick={onClose}>Close</button> {/* Close button */}
      <form onSubmit={handleSubmit} className="form">
        <h2>Welcome Back User</h2>
        <div className="form-group">
          <input
            type="email" // Change type to "email"
            name="email"
            placeholder="Email"
            ref={emailRef}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            ref={passwordRef}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="login-button">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
