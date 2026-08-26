import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TasksPage } from '../pages/TasksPage';
import { NotesPage } from '../pages/NotesPage';
import { CalendarPage } from '../pages/CalendarPage';
import { FinancePage } from '../pages/FinancePage';
import { AcademicPage } from '../pages/AcademicPage';
import { GradesPage } from '../pages/GradesPage';
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
            element: <TasksPage />,
          },
          {
            path: '/calendar',
            element: <CalendarPage />,
          },
          {
            path: '/academic',
            element: <AcademicPage />,
          },
          {
            path: '/study',
            element: <AcademicPage />,
          },
          {
            path: '/grades',
            element: <GradesPage />,
          },
          {
            path: '/gpa',
            element: <GradesPage />,
          },
          {
            path: '/finance',
            element: <FinancePage />,
          },
          {
            path: '/notes',
            element: <NotesPage />,
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