import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../../utils/tokenUtils';

// PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({ element: Element, ...rest }) => {
  const token = getToken();

  return token ? <Element {...rest} /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;