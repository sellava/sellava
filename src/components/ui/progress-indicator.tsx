import { Progress } from './progress';
import { CheckCircle, XCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;
  status: 'uploading' | 'success' | 'error';
  message?: string;
  className?: string;
}

export function ProgressIndicator({ 
  progress, 
  status, 
  message, 
  className = '' 
}: ProgressIndicatorProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'جاري الرفع...';
      case 'success':
        return 'تم الرفع بنجاح';
      case 'error':
        return 'فشل في الرفع';
      default:
        return '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {getStatusText()}
        </span>
        {getStatusIcon()}
      </div>
      <Progress value={progress} className="h-2" />
      {message && (
        <p className="text-xs text-gray-500">{message}</p>
      )}
    </div>
  );
} 