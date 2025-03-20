import React, { createContext, useContext, useEffect, useState } from 'react';
import { NotificationService } from '../services/NotificationService';
import { useInterval } from '../hooks/useInterval';

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = async () => {
    try {
      const count = await NotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread notifications count:', error);
    }
  };

  // Check for new notifications every minute
  useInterval(() => {
    refreshUnreadCount();
  }, 60000);

  // Initial fetch
  useEffect(() => {
    refreshUnreadCount();
  }, []);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
