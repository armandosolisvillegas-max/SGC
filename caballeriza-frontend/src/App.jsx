import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard';
import Caballos from './pages/Caballos/Caballos';
import Personal from './pages/Personal/Personal';
import Calendario from './pages/Calendario/Calendario';
import Alimentacion from './pages/Alimentacion/Alimentacion';
import Inventario from './pages/Inventario/Inventario';

// Layout wrappers
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar onMenuToggle={toggleSidebar} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public login/register page */}
          <Route path="/login" element={<Login />} />

          {/* Secure Private Pages */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </PrivateRoute>
          } />

          <Route path="/caballos" element={
            <PrivateRoute>
              <AppLayout>
                <Caballos />
              </AppLayout>
            </PrivateRoute>
          } />

          <Route path="/personal" element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['ADMINISTRADOR']}>
                <AppLayout>
                  <Personal />
                </AppLayout>
              </RoleRoute>
            </PrivateRoute>
          } />

          <Route path="/calendario" element={
            <PrivateRoute>
              <AppLayout>
                <Calendario />
              </AppLayout>
            </PrivateRoute>
          } />

          <Route path="/alimentacion" element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['ADMINISTRADOR', 'VETERINARIO', 'CUIDADOR']}>
                <AppLayout>
                  <Alimentacion />
                </AppLayout>
              </RoleRoute>
            </PrivateRoute>
          } />

          <Route path="/inventario" element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['ADMINISTRADOR', 'VETERINARIO']}>
                <AppLayout>
                  <Inventario />
                </AppLayout>
              </RoleRoute>
            </PrivateRoute>
          } />

          {/* Default Redirection */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
