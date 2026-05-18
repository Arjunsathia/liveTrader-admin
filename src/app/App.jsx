import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { adminRouter } from './routes/router';
import { AdminSessionProvider } from './providers/AdminSessionProvider';
import { AdminUiProvider } from './providers/AdminUiProvider';
import { UniversalDrawerProvider } from '../components/overlays';

function App() {
  return (
    <AdminSessionProvider>
      <AdminUiProvider>
        <UniversalDrawerProvider>
          <RouterProvider router={adminRouter} />
        </UniversalDrawerProvider>
      </AdminUiProvider>
    </AdminSessionProvider>
  );
}

export default App;
