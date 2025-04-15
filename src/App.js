import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './Theme/theme';
import LandingPage from './pages/LandingPage';
import CameraPage from './pages/CameraPage';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/camera" element={<CameraPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
