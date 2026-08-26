import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage, RegisterPage } from '../pages/AuthPlaceholders';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/tasks',
        element: <DashboardPage />,
      },
      {
        path: '/calendar',
        element: <DashboardPage />,
      },
      {
        path: '/study',
        element: <DashboardPage />,
      },
      {
        path: '/gpa',
        element: <DashboardPage />,
      },
      {
        path: '/finance',
        element: <DashboardPage />,
      },
      {
        path: '/notes',
        element: <DashboardPage />,
      },
      {
        path: '/snippets',
        element: <DashboardPage />,
      },
      {
        path: '/errors',
        element: <DashboardPage />,
      },
      {
        path: '/bookmarks',
        element: <DashboardPage />,
      },
      {
        path: '/statistics',
        element: <DashboardPage />,
      },
      {
        path: '/settings',
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
