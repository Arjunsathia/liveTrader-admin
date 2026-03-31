import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { adminRouter } from './app/routes/router';
import { AdminSessionProvider } from './app/providers/AdminSessionProvider';
import { AdminUiProvider } from './app/providers/AdminUiProvider';

function App() {
  return (
    <AdminSessionProvider>
      <AdminUiProvider>
        <RouterProvider router={adminRouter} />
      </AdminUiProvider>
    </AdminSessionProvider>
  );
}

export default App;
