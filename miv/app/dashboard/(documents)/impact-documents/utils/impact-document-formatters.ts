import { STATUS_CONFIG } from '../constants/impact-documents.constants';
import type { ImpactDocumentStatus } from '../types/impact-documents.types';

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function formatDocumentDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export function formatStatusOption(status: string) {
  return status === 'All Status'
    ? status
    : status.replace('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getDocumentStatusConfig(status: string) {
  return STATUS_CONFIG[status as ImpactDocumentStatus] || STATUS_CONFIG.pending_review;
}
