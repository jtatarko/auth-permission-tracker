import type { PermissionChange } from '@/data/types';
import { formatDateTime } from './date-utils';
import { authorizations } from '@/data/dummy-data';

export interface ExportOptions {
  includeAdded: boolean;
  includeRemoved: boolean;
  dateRange?: { from: Date; to: Date };
}

export const exportPermissionChangesToCSV = (
  permissionChanges: PermissionChange[],
  options: ExportOptions,
  filename?: string
): void => {
  // Filter data based on options
  let filteredData = permissionChanges.filter(change => {
    // Filter by action
    if (options.includeAdded && change.action === 'Added') return true;
    if (options.includeRemoved && change.action === 'Removed') return true;
    if (!options.includeAdded && !options.includeRemoved) return false;

    return (
      (options.includeAdded && change.action === 'Added') ||
      (options.includeRemoved && change.action === 'Removed')
    );
  });

  // Filter by date range if provided
  if (options.dateRange) {
    filteredData = filteredData.filter(change =>
      change.dateTime >= options.dateRange!.from &&
      change.dateTime <= options.dateRange!.to
    );
  }

  // Sort by date descending
  filteredData.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

  // Create CSV headers
  const headers = [
    'Date & Time',
    'Action',
    'Permission Name',
    'Permission ID',
    'Authorization Name',
    'Workspace',
    'Data Source',
    'Used in Datastreams',
    'Datastream Names'
  ];

  // Create CSV rows
  const rows = filteredData.map(change => {
    // Find the authorization name by authorizationId
    const authorization = authorizations.find(auth => auth.id === change.authorizationId);
    const authorizationName = authorization ? authorization.name : 'Unknown Authorization';

    return [
      `"${formatDateTime(change.dateTime)}"`, // Quote date to prevent Excel auto-formatting
      change.action,
      `"${change.permissionName}"`, // Quote to handle commas in permission names
      change.id,
      `"${authorizationName}"`, // Quote authorization name
      change.workspace,
      change.dataSource,
      change.usedInDatastreams.toString(),
      `"${change.datastreamNames.join(', ')}"` // Quote and join datastream names
    ];
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  // Create and download the file with BOM for proper encoding
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || generateFilename(options));
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

const generateFilename = (options: ExportOptions): string => {
  const today = new Date().toISOString().split('T')[0];
  const actions = [];

  if (options.includeAdded) actions.push('added');
  if (options.includeRemoved) actions.push('removed');

  const actionSuffix = actions.length > 0 ? `_${actions.join('_')}` : '';

  if (options.dateRange) {
    const fromDate = options.dateRange.from.toISOString().split('T')[0];
    const toDate = options.dateRange.to.toISOString().split('T')[0];
    return `permission_changes_${fromDate}_to_${toDate}${actionSuffix}.csv`;
  }

  return `permission_changes_${today}${actionSuffix}.csv`;
};

// Helper function to export authorization data
export const exportAuthorizationsToCSV = (
  authorizations: any[],
  filename?: string
): void => {
  const headers = [
    'Name',
    'Type',
    'Workspace',
    'Created',
    'Last Used',
    'Entities Count',
    'Datastreams Count',
    'Status'
  ];

  const rows = authorizations.map(auth => [
    `"${auth.name}"`,
    auth.type,
    auth.workspace,
    formatDateTime(auth.created),
    auth.lastUsed ? formatDateTime(auth.lastUsed) : 'Never',
    auth.entitiesCount.toString(),
    auth.datastreamsCount.toString(),
    auth.status
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `authorizations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};