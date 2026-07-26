import {
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

import type {
  ImpactDocumentStatus,
  ImpactDocumentStatusConfig,
  ImpactDocumentStatusFilter,
  ImpactDocumentTypeFilter,
} from '../types/impact-documents.types';

export const DOCUMENT_TYPES: ImpactDocumentTypeFilter[] = [
  'All Types',
  'Pitch Deck',
  'Financial Statements',
  'Legal Documents',
  'GEDSI Reports',
  'Impact Reports',
  'Other',
];

export const STATUS_OPTIONS: ImpactDocumentStatusFilter[] = [
  'All Status',
  'pending_review',
  'approved',
  'rejected',
  'needs_revision',
];

export const STATUS_CONFIG: Record<ImpactDocumentStatus, ImpactDocumentStatusConfig> = {
  pending_review: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Review', icon: Clock },
  approved: { color: 'bg-green-100 text-green-800', text: 'Approved', icon: CheckCircle },
  rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected', icon: XCircle },
  needs_revision: { color: 'bg-orange-100 text-orange-800', text: 'Needs Revision', icon: AlertCircle },
};
