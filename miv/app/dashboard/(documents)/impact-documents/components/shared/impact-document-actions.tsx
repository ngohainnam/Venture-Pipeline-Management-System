import { AlertCircle, CheckCircle, Download, Trash2, XCircle } from 'lucide-react';

import type { ImpactDocument } from '../../types/impact-documents.types';

interface ImpactDocumentActionsProps {
  document: ImpactDocument;
  onDownload: (documentId: string, filename: string) => void;
  onStatusUpdate: (documentId: string, newStatus: string) => void;
  onDelete: (documentId: string) => void;
}

export function ImpactDocumentActions({
  document,
  onDownload,
  onStatusUpdate,
  onDelete,
}: ImpactDocumentActionsProps) {
  return (
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={() => onDownload(document.id, document.filename)}
        className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-xs"
      >
        <Download className="w-3 h-3 mr-1" />
        Download
      </button>

      {document.status === 'pending_review' && (
        <div className="flex space-x-1">
          <button
            onClick={() => onStatusUpdate(document.id, 'approved')}
            className="inline-flex items-center px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors text-xs"
          >
            <CheckCircle className="w-3 h-3" />
          </button>
          <button
            onClick={() => onStatusUpdate(document.id, 'rejected')}
            className="inline-flex items-center px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-xs"
          >
            <XCircle className="w-3 h-3" />
          </button>
          <button
            onClick={() => onStatusUpdate(document.id, 'needs_revision')}
            className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-600 rounded hover:bg-orange-100 transition-colors text-xs"
          >
            <AlertCircle className="w-3 h-3" />
          </button>
        </div>
      )}

      <button
        onClick={() => onDelete(document.id)}
        className="inline-flex items-center px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-xs"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}
