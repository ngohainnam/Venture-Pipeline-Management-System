import { Building2, Calendar, File, User } from 'lucide-react';

import { ImpactDocumentActions } from './impact-document-actions';
import { ImpactDocumentStatusBadge } from './impact-document-status-badge';
import type { ImpactDocument } from '../../types/impact-documents.types';
import {
  formatDocumentDate,
  formatFileSize,
} from '../../utils/impact-document-formatters';

interface ImpactDocumentsTableProps {
  documents: ImpactDocument[];
  onDownload: (documentId: string, filename: string) => void;
  onStatusUpdate: (documentId: string, newStatus: string) => void;
  onDelete: (documentId: string) => void;
}

export function ImpactDocumentsTable({
  documents,
  onDownload,
  onStatusUpdate,
  onDelete,
}: ImpactDocumentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Document
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Uploaded By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Venture
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Upload Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center">
                  <File className="mr-3 h-10 w-10 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{doc.filename}</div>
                    <div className="text-xs text-gray-500">
                      {doc.documentType}
                      {' \u2022 '}
                      {formatFileSize(doc.filesize)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {doc.uploadedBy.firstName} {doc.uploadedBy.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{doc.uploadedBy.email}</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {doc.venture ? (
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-900">{doc.venture.name}</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">No venture</span>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <ImpactDocumentStatusBadge status={doc.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{formatDocumentDate(doc.createdAt)}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <ImpactDocumentActions
                  document={doc}
                  onDownload={onDownload}
                  onStatusUpdate={onStatusUpdate}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
