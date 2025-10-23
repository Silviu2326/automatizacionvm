/**
 * Layout optimizado para dispositivos móviles
 */

import React, { useState } from 'react';
import { Menu, X, Settings, Monitor, FileText, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ConnectionStatus } from './ConnectionStatus';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', icon: Monitor, href: '#dashboard' },
    { name: 'Configuración', icon: Settings, href: '#config' },
    { name: 'Archivos', icon: FileText, href: '#files' },
    { name: 'Monitoreo', icon: Activity, href: '#monitor' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header móvil */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <h1 className="text-lg font-semibold text-gray-900">
                Orquestador
              </h1>
            </div>
            <ConnectionStatus />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar móvil */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
            <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg">
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Menú</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <nav className="space-y-2">
                  {navigation.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-10"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <main className="flex-1 p-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MobileLayout;





