import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PublicOnlyRoute } from '../components/auth/PublicOnlyRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/tasks',
            element: <PlaceholderPage />,
          },
          {
            path: '/calendar',
            element: <PlaceholderPage />,
          },
          {
            path: '/study',
            element: <PlaceholderPage />,
          },
          {
            path: '/gpa',
            element: <PlaceholderPage />,
          },
          {
            path: '/finance',
            element: <PlaceholderPage />,
          },
          {
            path: '/notes',
            element: <PlaceholderPage />,
          },
          {
            path: '/snippets',
            element: <PlaceholderPage />,
          },
          {
            path: '/errors',
            element: <PlaceholderPage />,
          },
          {
            path: '/bookmarks',
            element: <PlaceholderPage />,
          },
          {
            path: '/statistics',
            element: <PlaceholderPage />,
          },
          {
            path: '/settings',
            element: <PlaceholderPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);