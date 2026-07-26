import type {
  ImpactDocument,
  ImpactDocumentStatusFilter,
  ImpactDocumentTypeFilter,
} from '../types/impact-documents.types';

interface FilterImpactDocumentsParams {
  documents: ImpactDocument[];
  searchQuery: string;
  selectedType: ImpactDocumentTypeFilter;
  selectedStatus: ImpactDocumentStatusFilter;
}

export function filterImpactDocuments({
  documents,
  searchQuery,
  selectedType,
  selectedStatus,
}: FilterImpactDocumentsParams) {
  let filtered = documents;

  if (searchQuery) {
    filtered = filtered.filter(
      (doc) =>
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.venture?.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  if (selectedType !== 'All Types') {
    filtered = filtered.filter((doc) => doc.documentType === selectedType);
  }

  if (selectedStatus !== 'All Status') {
    filtered = filtered.filter((doc) => doc.status === selectedStatus);
  }

  return filtered;
}
