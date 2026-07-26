'use client';

import { ImpactDocumentsDesktopView } from './desktop/impact-documents-desktop-view';
import { ImpactDocumentsMobileView } from './mobile/impact-documents-mobile-view';
import { useImpactDocuments } from '../hooks/use-impact-documents';

export function ImpactDocumentsPageContent() {
  const impactDocuments = useImpactDocuments();

  return (
    <>
      <ImpactDocumentsDesktopView impactDocuments={impactDocuments} />
      <ImpactDocumentsMobileView impactDocuments={impactDocuments} />
    </>
  );
}
