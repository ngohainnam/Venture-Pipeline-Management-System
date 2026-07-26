import { CheckCircle, Clock, FileText, XCircle } from 'lucide-react';

import type { ImpactDocumentStats as ImpactDocumentStatsType } from '../../types/impact-documents.types';

interface ImpactDocumentStatsProps {
  stats: ImpactDocumentStatsType;
}

export function ImpactDocumentStats({ stats }: ImpactDocumentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <FileText className="w-8 h-8 text-blue-500 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Documents</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <Clock className="w-8 h-8 text-yellow-500 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending Review</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            <p className="text-sm text-gray-600">Approved</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <XCircle className="w-8 h-8 text-red-500 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
