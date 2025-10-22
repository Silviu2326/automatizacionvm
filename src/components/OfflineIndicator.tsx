/**
 * Indicador de estado offline/online
 */

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showNotification && isOnline) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-all duration-300 ${
        isOnline 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {isOnline ? (
          <>
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Conexión restaurada</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">Sin conexión a internet</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;


