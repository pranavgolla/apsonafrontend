import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    // Redirect to login page if the user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the component if the user is authenticated
  return Component;
};

export default PrivateRoute;
