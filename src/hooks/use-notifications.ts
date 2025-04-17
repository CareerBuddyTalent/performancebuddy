
import { useState, useEffect } from 'react';

export interface Notification {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  actionUrl?: string;
}

// Mock notifications data - in a real app, this would come from an API
const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'Performance review due',
    description: 'Complete your quarterly performance review by Friday',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    type: 'info',
    actionUrl: '/reviews'
  },
  {
    id: 2,
    title: 'New feedback received',
    description: 'Jane Doe has provided feedback on your recent project',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: false,
    type: 'success',
    actionUrl: '/feedback'
  },
  {
    id: 3,
    title: 'Goal deadline approaching',
    description: 'Your "Improve communication skills" goal deadline is tomorrow',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
    type: 'warning',
    actionUrl: '/goals'
  },
  {
    id: 4,
    title: 'Survey reminder',
    description: 'Please complete the employee satisfaction survey',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    read: true,
    type: 'info',
    actionUrl: '/surveys'
  }
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      createdAt: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification
  };
}
