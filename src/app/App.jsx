import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { adminRouter } from './routes/router';
import { AdminSessionProvider } from './providers/AdminSessionProvider';
import { AdminUiProvider } from './providers/AdminUiProvider';

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
