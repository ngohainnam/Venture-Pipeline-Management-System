import { File } from 'lucide-react';

export function ImpactDocumentsEmpty() {
  return (
    <div className="text-center py-12">
      <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">No documents found</p>
    </div>
  );
}
