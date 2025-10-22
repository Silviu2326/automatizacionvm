/**
 * Modal para crear nuevos dashboards
 */

import React, { useState } from 'react';
import { X, Server, Monitor } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

interface CreateDashboardModalProps {
  onClose: () => void;
  onCreate: (name: string, vmHost: string, vmPort: number) => void;
}

export const CreateDashboardModal: React.FC<CreateDashboardModalProps> = ({
  onClose,
  onCreate
}) => {
  const [name, setName] = useState('');
  const [vmHost, setVmHost] = useState('localhost');
  const [vmPort, setVmPort] = useState(3001);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && vmHost.trim() && vmPort > 0) {
      onCreate(name.trim(), vmHost.trim(), vmPort);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Monitor className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Crear Nuevo Dashboard
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cerrar</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre del Dashboard
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: VM-Producción, VM-Desarrollo, etc."
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="vmHost" className="text-sm font-medium text-gray-700">
              Host de la VM
            </Label>
            <Input
              id="vmHost"
              type="text"
              value={vmHost}
              onChange={(e) => setVmHost(e.target.value)}
              placeholder="localhost, 192.168.1.100, etc."
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="vmPort" className="text-sm font-medium text-gray-700">
              Puerto de la VM
            </Label>
            <Input
              id="vmPort"
              type="number"
              value={vmPort}
              onChange={(e) => setVmPort(parseInt(e.target.value) || 3001)}
              placeholder="3001"
              min="1"
              max="65535"
              className="mt-1"
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Server className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  Información de Conexión
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  Asegúrate de que el orquestador esté ejecutándose en la VM especificada
                  y que el puerto esté disponible para la conexión.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !vmHost.trim() || vmPort <= 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Crear Dashboard
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};



