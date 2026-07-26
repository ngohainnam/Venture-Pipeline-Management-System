import type { ComponentType } from 'react';

export type ImpactDocumentStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'needs_revision';

export type ImpactDocumentStatusFilter = 'All Status' | ImpactDocumentStatus;

export type ImpactDocumentTypeFilter =
  | 'All Types'
  | 'Pitch Deck'
  | 'Financial Statements'
  | 'Legal Documents'
  | 'GEDSI Reports'
  | 'Impact Reports'
  | 'Other';

export interface ImpactDocument {
  id: string;
  filename: string;
  documentType: string;
  status: ImpactDocumentStatus;
  version: number;
  filesize: number;
  mimeType: string;
  url: string;
  notes?: string;
  uploadedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  venture?: {
    id: string;
    name: string;
  };
  reviewedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImpactDocumentsResponse {
  success?: boolean;
  documents?: ImpactDocument[];
  message?: string;
}

export interface ImpactDocumentMutationResponse {
  success?: boolean;
  message?: string;
}

export interface UpdateImpactDocumentStatusPayload {
  status: string;
  notes?: string;
}

export interface ImpactDocumentStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface ImpactDocumentStatusConfig {
  color: string;
  text: string;
  icon: ComponentType<{ className?: string }>;
}

export interface UseImpactDocumentsResult {
  documents: ImpactDocument[];
  filteredDocuments: ImpactDocument[];
  loading: boolean;
  searchQuery: string;
  selectedType: ImpactDocumentTypeFilter;
  selectedStatus: ImpactDocumentStatusFilter;
  error: string;
  success: string;
  stats: ImpactDocumentStats;
  fetchDocuments: () => Promise<void>;
  setSearchQuery: (value: string) => void;
  setSelectedType: (value: ImpactDocumentTypeFilter) => void;
  setSelectedStatus: (value: ImpactDocumentStatusFilter) => void;
  setError: (value: string) => void;
  setSuccess: (value: string) => void;
  handleStatusUpdate: (documentId: string, newStatus: string, notes?: string) => Promise<void>;
  handleDelete: (documentId: string) => Promise<void>;
  handleDownload: (documentId: string, filename: string) => Promise<void>;
}
