import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element }:any) => {
  const user = useSelector((state:any) => state.user);
  if (!user.body || !sessionStorage.getItem('idToken')) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
