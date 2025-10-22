/**
 * Componente principal para gestionar múltiples dashboards
 */

import React, { useState, useEffect } from 'react';
import { Plus, Settings, Trash2, Monitor, Server } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { OrquestadorDashboard } from './OrquestadorDashboard';
import { CreateDashboardModal } from './CreateDashboardModal';

export interface DashboardInstance {
  id: string;
  name: string;
  vmHost: string;
  vmPort: number;
  status: 'online' | 'offline' | 'error';
  lastSeen: Date;
  isActive: boolean;
}

export const DashboardManager: React.FC = () => {
  const [dashboards, setDashboards] = useState<DashboardInstance[]>([]);
  const [activeDashboard, setActiveDashboard] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Cargar dashboards guardados
  useEffect(() => {
    const savedDashboards = localStorage.getItem('orquestador-dashboards');
    if (savedDashboards) {
      const parsed = JSON.parse(savedDashboards);
      setDashboards(parsed);
      if (parsed.length > 0 && !activeDashboard) {
        setActiveDashboard(parsed[0].id);
      }
    }
  }, []);

  // Guardar dashboards
  useEffect(() => {
    if (dashboards.length > 0) {
      localStorage.setItem('orquestador-dashboards', JSON.stringify(dashboards));
    }
  }, [dashboards]);

  const createDashboard = (name: string, vmHost: string, vmPort: number) => {
    const newDashboard: DashboardInstance = {
      id: `dashboard-${Date.now()}`,
      name,
      vmHost,
      vmPort,
      status: 'offline',
      lastSeen: new Date(),
      isActive: false
    };

    setDashboards(prev => [...prev, newDashboard]);
    setActiveDashboard(newDashboard.id);
    setShowCreateModal(false);
  };

  const deleteDashboard = (id: string) => {
    setDashboards(prev => {
      const updated = prev.filter(d => d.id !== id);
      if (activeDashboard === id && updated.length > 0) {
        setActiveDashboard(updated[0].id);
      } else if (updated.length === 0) {
        setActiveDashboard(null);
      }
      return updated;
    });
  };

  const switchDashboard = (id: string) => {
    setActiveDashboard(id);
  };

  const currentDashboard = dashboards.find(d => d.id === activeDashboard);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con gestión de dashboards */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Monitor className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Orquestador Multi-VM
                </h1>
              </div>
              
              {/* Selector de dashboards */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Dashboard:</span>
                <select
                  value={activeDashboard || ''}
                  onChange={(e) => setActiveDashboard(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  {dashboards.map(dashboard => (
                    <option key={dashboard.id} value={dashboard.id}>
                      {dashboard.name} ({dashboard.vmHost}:{dashboard.vmPort})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Estado del dashboard activo */}
              {currentDashboard && (
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    currentDashboard.status === 'online' ? 'bg-green-500' : 
                    currentDashboard.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm text-gray-600">
                    {currentDashboard.status === 'online' ? 'Conectado' :
                     currentDashboard.status === 'error' ? 'Error' : 'Desconectado'}
                  </span>
                </div>
              )}

              {/* Botones de gestión */}
              <Button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Nuevo Dashboard</span>
              </Button>

              {currentDashboard && (
                <Button
                  variant="outline"
                  onClick={() => deleteDashboard(currentDashboard.id)}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de dashboards */}
      {dashboards.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4 overflow-x-auto">
              {dashboards.map(dashboard => (
                <Card
                  key={dashboard.id}
                  className={`p-4 cursor-pointer transition-all duration-200 min-w-0 ${
                    activeDashboard === dashboard.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => switchDashboard(dashboard.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Server className="h-5 w-5 text-gray-500" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {dashboard.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {dashboard.vmHost}:{dashboard.vmPort}
                      </p>
                    </div>
                    <Badge
                      variant={dashboard.status === 'online' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {dashboard.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentDashboard ? (
          <OrquestadorDashboard
            key={currentDashboard.id}
            dashboardId={currentDashboard.id}
            vmHost={currentDashboard.vmHost}
            vmPort={currentDashboard.vmPort}
          />
        ) : (
          <div className="text-center py-12">
            <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay dashboards configurados
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer dashboard para comenzar a gestionar orquestadores
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Crear Dashboard</span>
            </Button>
          </div>
        )}
      </div>

      {/* Modal para crear dashboard */}
      {showCreateModal && (
        <CreateDashboardModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createDashboard}
        />
      )}
    </div>
  );
};



