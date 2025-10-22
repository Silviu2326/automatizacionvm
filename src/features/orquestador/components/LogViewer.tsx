import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Pause, Play, Filter, Download } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface LogViewerProps {
  logs: LogEntry[];
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const [filter, setFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all');
  const [isPaused, setIsPaused] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logs.filter(log => 
    filter === 'all' || log.level === filter
  );

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '📝';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const clearLogs = () => {
    // Esta función debería ser pasada como prop desde el componente padre
    console.log('Clearing logs...');
  };

  const exportLogs = () => {
    const logText = filteredLogs.map(log => 
      `[${formatTime(log.timestamp)}] ${log.level.toUpperCase()}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orquestador-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logContainerRef.current && !isPaused) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  return (
    <Card className="h-96 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📝 Log de Ejecución</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center space-x-1"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              <span>{isPaused ? 'Reanudar' : 'Pausar'}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearLogs}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Limpiar</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportLogs}
              className="flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filtrar:</span>
          <div className="flex space-x-1">
            {(['all', 'info', 'success', 'warning', 'error'] as const).map((level) => (
              <Button
                key={level}
                variant={filter === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(level)}
                className="text-xs"
              >
                {level === 'all' ? 'Todos' : level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div 
        ref={logContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No hay logs disponibles</p>
            <p className="text-sm">Los logs aparecerán aquí cuando se ejecute el orquestador</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-lg border text-sm ${getLevelColor(log.level)}`}
            >
              <div className="flex items-start space-x-2">
                <span className="text-lg">{getLevelIcon(log.level)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-mono text-xs text-gray-500">
                      {formatTime(log.timestamp)}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getLevelColor(log.level)}`}
                    >
                      {log.level.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-gray-800 break-words">{log.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total logs: {filteredLogs.length}</span>
          <span>
            {isPaused && (
              <Badge variant="secondary" className="text-xs">
                Pausado
              </Badge>
            )}
          </span>
        </div>
      </div>
    </Card>
  );
};
