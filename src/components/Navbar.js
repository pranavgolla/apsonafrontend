import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#007bff',
    color: 'white',
  },
  h2: {
    margin: 0,
  },
  ul: {
    listStyle: 'none',
    display: 'flex',
    margin: 0,
    padding: 0,
  },
  li: {
    marginLeft: '1rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  button: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.h2}>Notes App</h2>
      <ul style={styles.ul}>
        <li style={styles.li}><Link to="/" style={styles.link}>Home</Link></li>
        <li style={styles.li}><button onClick={handleLogout} style={styles.button}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
