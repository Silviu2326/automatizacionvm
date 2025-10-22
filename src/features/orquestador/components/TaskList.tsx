import React from 'react';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

interface Task {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  startTime?: Date;
  endTime?: Date;
  duration?: string;
}

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'text-gray-500 bg-gray-50 border-gray-200';
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'Procesando';
      case 'completed':
        return 'Completado';
      case 'error':
        return 'Error';
      default:
        return 'Pendiente';
    }
  };

  const formatDuration = (startTime: Date, endTime: Date) => {
    const diff = endTime.getTime() - startTime.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  // Usar solo las tareas reales del orquestador
  const displayTasks = tasks;

  const completedTasks = displayTasks.filter(task => task.status === 'completed').length;
  const processingTasks = displayTasks.filter(task => task.status === 'processing').length;
  const errorTasks = displayTasks.filter(task => task.status === 'error').length;

  return (
    <Card className="h-96 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📋 Lista de Tareas</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{completedTasks}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Loader2 className="h-4 w-4 text-blue-500" />
              <span>{processingTasks}</span>
            </span>
            <span className="flex items-center space-x-1">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span>{errorTasks}</span>
            </span>
          </div>
        </div>

        {displayTasks.length > 0 ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Progreso:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedTasks / displayTasks.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {Math.round((completedTasks / displayTasks.length) * 100)}%
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Estado:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-gray-300 h-2 rounded-full w-full" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Inactivo
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {displayTasks.length > 0 ? (
          displayTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                task.status === 'processing' 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(task.status)}
                  <div>
                    <p className="font-medium text-gray-900">{task.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(task.status)}`}
                      >
                        {getStatusText(task.status)}
                      </Badge>
                      {task.duration && (
                        <span className="text-xs text-gray-500">
                          Duración: {task.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {task.startTime && (
                    <p className="text-xs text-gray-500">
                      Inicio: {task.startTime.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                  {task.endTime && task.startTime && (
                    <p className="text-xs text-gray-500">
                      Duración: {formatDuration(task.startTime, task.endTime)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay tareas activas
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Las tareas aparecerán aquí cuando inicies el orquestador
            </p>
            <div className="text-xs text-gray-400">
              💡 Inicia el orquestador para ver las tareas en tiempo real
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total tareas: {displayTasks.length}</span>
          {displayTasks.length > 0 ? (
            <span>
              Completadas: {completedTasks} | 
              En proceso: {processingTasks} | 
              Errores: {errorTasks}
            </span>
          ) : (
            <span className="text-gray-500">
              Esperando inicio del orquestador...
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
