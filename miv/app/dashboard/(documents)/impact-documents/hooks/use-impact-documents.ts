'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  deleteDocument,
  downloadDocument,
  getImpactDocuments,
  updateDocumentStatus,
} from '../api/impact-documents-api';
import { calculateDocumentStats } from '../utils/impact-document-calculations';
import { filterImpactDocuments } from '../utils/impact-document-filters';
import type {
  ImpactDocument,
  ImpactDocumentStatusFilter,
  ImpactDocumentTypeFilter,
  UseImpactDocumentsResult,
} from '../types/impact-documents.types';

export function useImpactDocuments(): UseImpactDocumentsResult {
  const [documents, setDocuments] = useState<ImpactDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ImpactDocumentTypeFilter>('All Types');
  const [selectedStatus, setSelectedStatus] = useState<ImpactDocumentStatusFilter>('All Status');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const { res, data } = await getImpactDocuments();

      if (res.ok) {
        if (data.success && data.documents) {
          setDocuments(data.documents);
        }
      } else {
        setError(data.message || 'Failed to fetch documents');
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredDocuments = useMemo(
    () =>
      filterImpactDocuments({
        documents,
        searchQuery,
        selectedType,
        selectedStatus,
      }),
    [documents, searchQuery, selectedType, selectedStatus],
  );

  const stats = useMemo(() => calculateDocumentStats(documents), [documents]);

  const handleStatusUpdate = async (documentId: string, newStatus: string, notes?: string) => {
    try {
      const { res, data } = await updateDocumentStatus(documentId, { status: newStatus, notes });

      if (res.ok && data.success) {
        setSuccess('Document status updated successfully');
        fetchDocuments();
      } else {
        setError(data.message || 'Failed to update document status');
      }
    } catch (err) {
      console.error('Status update error:', err);
      setError('An error occurred while updating status');
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    try {
      const { res, data } = await deleteDocument(documentId);

      if (res.ok && data.success) {
        setSuccess('Document deleted successfully');
        fetchDocuments();
      } else {
        setError(data.message || 'Failed to delete document');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('An error occurred while deleting');
    }
  };

  const handleDownload = async (documentId: string, filename: string) => {
    try {
      const res = await downloadDocument(documentId);

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to download document');
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('An error occurred while downloading');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
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
  };
}
