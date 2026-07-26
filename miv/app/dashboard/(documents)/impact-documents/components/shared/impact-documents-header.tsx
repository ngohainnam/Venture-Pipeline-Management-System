import { RefreshCw } from 'lucide-react';

interface ImpactDocumentsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function ImpactDocumentsHeader({ loading, onRefresh }: ImpactDocumentsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact Documents Management</h1>
          <p className="text-gray-600">Review and manage documents uploaded by venture founders</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
    </div>
  );
}
