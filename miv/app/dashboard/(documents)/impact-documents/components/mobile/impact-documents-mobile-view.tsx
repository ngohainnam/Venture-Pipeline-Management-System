import { File } from 'lucide-react';

import { ImpactDocumentActions } from '../shared/impact-document-actions';
import { ImpactDocumentFilters } from '../shared/impact-document-filters';
import { ImpactDocumentStats } from '../shared/impact-document-stats';
import { ImpactDocumentStatusBadge } from '../shared/impact-document-status-badge';
import { ImpactDocumentsAlert } from '../shared/impact-documents-alert';
import { ImpactDocumentsEmpty } from '../shared/impact-documents-empty';
import { ImpactDocumentsHeader } from '../shared/impact-documents-header';
import { ImpactDocumentsLoading } from '../shared/impact-documents-loading';
import type { UseImpactDocumentsResult } from '../../types/impact-documents.types';
import {
  formatDocumentDate,
  formatFileSize,
} from '../../utils/impact-document-formatters';

interface ImpactDocumentsMobileViewProps {
  impactDocuments: UseImpactDocumentsResult;
}

export function ImpactDocumentsMobileView({ impactDocuments }: ImpactDocumentsMobileViewProps) {
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
    handleDownload,
    handleStatusUpdate,
    handleDelete,
  } = impactDocuments;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 lg:hidden">
      {/* TODO: Replace this placeholder with the approved mobile Impact Documents design. */}
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
        <div className="border-b border-gray-200 px-4 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Documents ({filteredDocuments.length})
          </h2>
        </div>

        {loading ? (
          <ImpactDocumentsLoading />
        ) : filteredDocuments.length === 0 ? (
          <ImpactDocumentsEmpty />
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDocuments.map((doc) => (
              <article key={doc.id} className="space-y-4 p-4">
                <div className="flex items-start gap-3">
                  <File className="mt-0.5 h-8 w-8 shrink-0 text-blue-500" />
                  <div className="min-w-0 flex-1">
                    <h3 className="wrap-break-word text-sm font-medium text-gray-900">{doc.filename}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {doc.documentType}
                      {' \u2022 '}
                      {formatFileSize(doc.filesize)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium text-gray-700">Uploaded by: </span>
                    {doc.uploadedBy.firstName} {doc.uploadedBy.lastName}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Venture: </span>
                    {doc.venture?.name || 'No venture'}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Upload date: </span>
                    {formatDocumentDate(doc.createdAt)}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <ImpactDocumentStatusBadge status={doc.status} />
                  <ImpactDocumentActions
                    document={doc}
                    onDownload={handleDownload}
                    onStatusUpdate={handleStatusUpdate}
                    onDelete={handleDelete}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
