import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AdminProvider } from './context/AdminContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <AdminProvider>
      <App />
    </AdminProvider>
  </ThemeProvider>
);

