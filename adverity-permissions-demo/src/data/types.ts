export type DataSourceType =
  | 'Meta'
  | 'Google Ads'
  | 'Amazon Advertising'
  | 'Google Sheets'
  | 'Facebook Ads'
  | 'LinkedIn Ads'
  | 'TikTok Ads'
  | 'Twitter Ads';

export interface PermissionChange {
  id: string;
  authorizationId: string;
  permissionName: string;
  action: 'Added' | 'Removed';
  dateTime: Date;
  workspace: string;
  dataSource: string;
  datastreamNames: string[];
  usedInDatastreams: number;
}

export interface Authorization {
  id: string;
  name: string;
  type: DataSourceType;
  workspace: string;
  created: Date;
  lastUsed: Date | null;
  permissionsCount: number;
  datastreamsCount: number;
  status: 'Connected' | 'Expired' | 'Pending';
}

export interface EmailNotificationProps {
  permissionChanges: PermissionChange[];
  onSeeDetails: (authId: string, emailDateRange: { from: Date; to: Date }) => void;
}

export interface PermissionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  authorizationId: string;
  initialDateRange?: { from: Date; to: Date };
  initialFilters?: { action?: 'Added' | 'Removed' | 'All' };
}

export interface AuthorizationDetailProps {
  authorization: Authorization;
  onViewChanges: () => void;
  onNavigateToList: () => void;
}

export interface AuthorizationsPageState {
  selectedItems: string[];
  filters: {
    workspace: string;
    dataSource: string;
    status: string;
  };
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  chartDateRange: { from: Date; to: Date };
}

export interface DatastreamExamples {
  'Amazon Advertising': string[];
  'Google Ads': string[];
  'Meta': string[];
  'Google Sheets': string[];
  'LinkedIn Ads': string[];
  'TikTok Ads': string[];
  'Twitter Ads': string[];
}