import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5'
  },
  form: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    margin: '0.5rem 0',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  button: {
    width: '100%',
    padding: '0.8rem',
    margin: '1rem 0',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  buttonHover: {
    backgroundColor: '#0056b3'
  },
  error: {
    color: 'red',
    marginTop: '1rem'
  }
};

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  // Check for token and redirect if present
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // Redirect to home if token is present
    }
  }, [navigate]);

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await axios.post('/api/auth/register', {
        email,
        password
      });
      console.log('Registration successful:', res.data);
      navigate('/login'); // Redirect to login page upon successful registration
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Registration failed');
      } else {
        setError('Network error or server not reachable');
      }
      console.error('Registration error:', err);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={onSubmit} style={styles.form}>
        <h1>Register</h1>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Register</button>
        <button
          type="button"
          onClick={() => navigate('/login')} // Navigate to /login
          style={styles.button}
        >
          Go to Login
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
