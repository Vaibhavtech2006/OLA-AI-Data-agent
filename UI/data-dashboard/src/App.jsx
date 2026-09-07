import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage onNavigate={setCurrentView} />
      ) : (
        <DashboardPage onNavigate={setCurrentView} />
      )}
    </>
  );
}