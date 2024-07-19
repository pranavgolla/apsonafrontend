import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Notes from './components/Notes';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute element={<Notes />} />} />
        <Route path='*'element={<NotFound/>} /> 
      </Routes>
    </Router>
  );
};

export default App;
