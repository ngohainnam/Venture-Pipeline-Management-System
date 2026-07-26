import { getDocumentStatusConfig } from '../../utils/impact-document-formatters';

interface ImpactDocumentStatusBadgeProps {
  status: string;
}

export function ImpactDocumentStatusBadge({ status }: ImpactDocumentStatusBadgeProps) {
  const config = getDocumentStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.color}`}>
      <IconComponent className="mr-1 h-3 w-3" />
      {config.text}
    </div>
  );
}
