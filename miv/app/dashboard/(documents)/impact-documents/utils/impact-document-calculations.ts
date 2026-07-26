import type { ImpactDocument, ImpactDocumentStats } from '../types/impact-documents.types';

export function calculateDocumentStats(documents: ImpactDocument[]): ImpactDocumentStats {
  return documents.reduce<ImpactDocumentStats>(
    (acc, doc) => {
      acc.total++;
      if (doc.status === 'pending_review') acc.pending++;
      else if (doc.status === 'approved') acc.approved++;
      else if (doc.status === 'rejected') acc.rejected++;
      return acc;
    },
    { total: 0, pending: 0, approved: 0, rejected: 0 },
  );
}
