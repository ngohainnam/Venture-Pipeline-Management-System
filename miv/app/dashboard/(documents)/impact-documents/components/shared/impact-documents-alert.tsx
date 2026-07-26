import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ImpactDocumentsAlertProps {
  message: string;
  type: 'error' | 'success';
  onDismiss: () => void;
}

export function ImpactDocumentsAlert({ message, type, onDismiss }: ImpactDocumentsAlertProps) {
  if (type === 'error') {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
        <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
        <p className="text-red-800">{message}</p>
        <button onClick={onDismiss} className="ml-auto">
          <XCircle className="w-5 h-5 text-red-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
      <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
      <p className="text-green-800">{message}</p>
      <button onClick={onDismiss} className="ml-auto">
        <XCircle className="w-5 h-5 text-green-600" />
      </button>
    </div>
  );
}
