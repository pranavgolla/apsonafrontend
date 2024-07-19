import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router for routing

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <p style={styles.message}>Oops! The page you’re looking for doesn’t exist.</p>
      <Link to="/" style={styles.link}>Go back to Home</Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f4f4f4',
  },
  heading: {
    fontSize: '6rem',
    margin: 0,
    color: '#333',
  },
  message: {
    fontSize: '1.5rem',
    color: '#666',
  },
  link: {
    fontSize: '1rem',
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default NotFound;
