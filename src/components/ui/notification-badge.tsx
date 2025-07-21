import { Badge } from './badge';
import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
  count: number;
  className?: string;
  onClick?: () => void;
}

export function NotificationBadge({ count, className = '', onClick }: NotificationBadgeProps) {
  if (count === 0) {
    return (
      <div 
        className={`relative cursor-pointer ${className}`}
        onClick={onClick}
      >
        <Bell className="h-5 w-5 text-gray-400" />
      </div>
    );
  }

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      onClick={onClick}
    >
      <Bell className="h-5 w-5 text-gray-600" />
      <Badge 
        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-red-500 text-white border-2 border-white"
      >
        {count > 99 ? '99+' : count}
      </Badge>
    </div>
  );
} 