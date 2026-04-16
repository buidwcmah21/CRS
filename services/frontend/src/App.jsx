import React from 'react';
import { AuthProvider } from './AuthProvider';
import AppRoutes from './Routes';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      {/* Cấu hình Toaster hiện ở góc trên bên phải */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      />
      <Navbar />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;