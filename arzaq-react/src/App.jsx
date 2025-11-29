import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Loading from './components/common/Loading/Loading';
import SkipLink from './components/common/SkipLink/SkipLink';
import RoleGuard from './components/common/RoleGuard/RoleGuard';
import './styles/global.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const MapPage = lazy(() => import('./pages/MapPage/MapPage'));
const CartPage = lazy(() => import('./pages/CartPage/CartPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage/CommunityPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard/AdminDashboard'));
const RestaurantDashboard = lazy(() => import('./pages/RestaurantDashboard/RestaurantDashboard'));
const RestaurantDetailsPage = lazy(() => import('./pages/RestaurantDetailsPage/RestaurantDetailsPage'));

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <SkipLink />
            <Suspense fallback={<Loading fullscreen />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />

                {/* Admin-only routes */}
                <Route
                  path="/admin"
                  element={
                    <RoleGuard allowedRoles={['admin']}>
                      <AdminDashboard />
                    </RoleGuard>
                  }
                />

                {/* Restaurant-only routes */}
                <Route
                  path="/restaurant-dashboard"
                  element={
                    <RoleGuard allowedRoles={['restaurant']}>
                      <RestaurantDashboard />
                    </RoleGuard>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;