import { ImpactDocumentFilters } from '../shared/impact-document-filters';
import { ImpactDocumentStats } from '../shared/impact-document-stats';
import { ImpactDocumentsAlert } from '../shared/impact-documents-alert';
import { ImpactDocumentsEmpty } from '../shared/impact-documents-empty';
import { ImpactDocumentsHeader } from '../shared/impact-documents-header';
import { ImpactDocumentsLoading } from '../shared/impact-documents-loading';
import { ImpactDocumentsTable } from '../shared/impact-documents-table';
import type { UseImpactDocumentsResult } from '../../types/impact-documents.types';

interface ImpactDocumentsDesktopViewProps {
  impactDocuments: UseImpactDocumentsResult;
}

export function ImpactDocumentsDesktopView({ impactDocuments }: ImpactDocumentsDesktopViewProps) {
  const {
    filteredDocuments,
    loading,
    searchQuery,
    selectedType,
    selectedStatus,
    error,
    success,
    stats,
    fetchDocuments,
    setSearchQuery,
    setSelectedType,
    setSelectedStatus,
    setError,
    setSuccess,
    handleStatusUpdate,
    handleDelete,
    handleDownload,
  } = impactDocuments;

  return (
    <div className="hidden min-h-screen bg-gray-50 px-4 py-8 lg:block">
      <div className="mx-auto max-w-7xl">
        <ImpactDocumentsHeader loading={loading} onRefresh={fetchDocuments} />

        <ImpactDocumentStats stats={stats} />

        {error && (
          <ImpactDocumentsAlert message={error} type="error" onDismiss={() => setError('')} />
        )}

        {success && (
          <ImpactDocumentsAlert message={success} type="success" onDismiss={() => setSuccess('')} />
        )}

        <ImpactDocumentFilters
          searchQuery={searchQuery}
          selectedType={selectedType}
          selectedStatus={selectedStatus}
          onSearchQueryChange={setSearchQuery}
          onSelectedTypeChange={setSelectedType}
          onSelectedStatusChange={setSelectedStatus}
        />

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Documents ({filteredDocuments.length})
            </h2>
          </div>

          {loading ? (
            <ImpactDocumentsLoading />
          ) : filteredDocuments.length === 0 ? (
            <ImpactDocumentsEmpty />
          ) : (
            <ImpactDocumentsTable
              documents={filteredDocuments}
              onDownload={handleDownload}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
