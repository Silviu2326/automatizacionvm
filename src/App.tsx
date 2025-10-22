import React from 'react';
import { DashboardManager } from './features/orquestador/components/DashboardManager';
import { MobileLayout } from './components/MobileLayout';
import { OfflineIndicator } from './components/OfflineIndicator';

function App() {
  return (
    <>
      <OfflineIndicator />
      <MobileLayout>
        <DashboardManager />
      </MobileLayout>
    </>
  );
}

export default App;