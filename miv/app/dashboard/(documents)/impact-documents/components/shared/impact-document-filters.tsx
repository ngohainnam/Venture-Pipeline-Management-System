import { Search } from 'lucide-react';

import { DOCUMENT_TYPES, STATUS_OPTIONS } from '../../constants/impact-documents.constants';
import type {
  ImpactDocumentStatusFilter,
  ImpactDocumentTypeFilter,
} from '../../types/impact-documents.types';
import { formatStatusOption } from '../../utils/impact-document-formatters';

interface ImpactDocumentFiltersProps {
  searchQuery: string;
  selectedType: ImpactDocumentTypeFilter;
  selectedStatus: ImpactDocumentStatusFilter;
  onSearchQueryChange: (value: string) => void;
  onSelectedTypeChange: (value: ImpactDocumentTypeFilter) => void;
  onSelectedStatusChange: (value: ImpactDocumentStatusFilter) => void;
}

export function ImpactDocumentFilters({
  searchQuery,
  selectedType,
  selectedStatus,
  onSearchQueryChange,
  onSelectedTypeChange,
  onSelectedStatusChange,
}: ImpactDocumentFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by filename, user, or venture..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="md:w-48">
          <select
            value={selectedType}
            onChange={(e) => onSelectedTypeChange(e.target.value as ImpactDocumentTypeFilter)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="md:w-48">
          <select
            value={selectedStatus}
            onChange={(e) => onSelectedStatusChange(e.target.value as ImpactDocumentStatusFilter)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {formatStatusOption(status)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
