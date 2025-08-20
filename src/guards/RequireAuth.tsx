import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function RequireAuth() {
  const location = useLocation();
  const token = localStorage.getItem('accessToken'); // 또는 쿠키/전역상태

  if (!token) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  return <Outlet />;
}
