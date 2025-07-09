import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import App from '../App';


const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
    },{
      path: '/',
      element: <App />,
    }
  ]);
  return <RouterProvider router={router} />;
};

export default Router; 