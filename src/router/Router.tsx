import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import App from '../App';
import CalendarPage from '../pages/CalendarPage'



const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
    },{
      path: '/calendar',
      element: <CalendarPage />,
    }
  ]);
  return <RouterProvider router={router} />;
};

export default Router; 