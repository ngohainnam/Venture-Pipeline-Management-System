import type {
  ImpactDocumentMutationResponse,
  ImpactDocumentsResponse,
  UpdateImpactDocumentStatusPayload,
} from '../types/impact-documents.types';

export async function getImpactDocuments() {
  const res = await fetch('/backend/api/documents', {
    credentials: 'include',
  });

  const data = (await res.json()) as ImpactDocumentsResponse;
  return { res, data };
}

export async function updateDocumentStatus(
  documentId: string,
  payload: UpdateImpactDocumentStatusPayload,
) {
  const res = await fetch(`/backend/api/documents/${documentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as ImpactDocumentMutationResponse;
  return { res, data };
}

export async function deleteDocument(documentId: string) {
  const res = await fetch(`/backend/api/documents?id=${documentId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = (await res.json()) as ImpactDocumentMutationResponse;
  return { res, data };
}

export async function downloadDocument(documentId: string) {
  return fetch(`/backend/api/documents/${documentId}?download=true`, {
    credentials: 'include',
  });
}
