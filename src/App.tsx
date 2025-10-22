import React from 'react';
import { DashboardManager } from './features/orquestador/components/DashboardManager';
import { MobileLayout } from './components/MobileLayout';
import { OfflineIndicator } from './components/OfflineIndicator';
import { config } from './lib/config';

function App() {
  // Debug: mostrar configuración en consola
  console.log('🔧 Configuración de la aplicación:', {
    apiUrl: config.apiUrl,
    wsUrl: config.wsUrl,
    debug: config.debug
  });

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