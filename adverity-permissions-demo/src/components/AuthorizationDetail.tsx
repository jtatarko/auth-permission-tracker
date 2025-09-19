import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { AuthorizationDetailProps } from '@/data/types';
import { formatDateShort, formatRelativeTime } from '@/utils/date-utils';
import { getPermissionChangesForAuth } from '@/data/dummy-data';
import PermissionsDrawer from './PermissionsDrawer';
import {
  ChevronRight,
  Home,
  Calendar,
  Activity,
  Settings,
  Eye,
  Database,
  Users
} from 'lucide-react';

const AuthorizationDetail: React.FC<AuthorizationDetailProps> = ({
  authorization,
  onViewChanges,
  onNavigateToList
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [autoOpenDrawer, setAutoOpenDrawer] = useState(false);
  const [drawerDateRange] = useState<{ from: Date; to: Date } | undefined>();

  // Get permission changes for this authorization
  const permissionChanges = getPermissionChangesForAuth(authorization.id);
  const recentChanges = permissionChanges.slice(0, 5);

  // Auto-open drawer if coming from email
  useEffect(() => {
    if (autoOpenDrawer) {
      setIsDrawerOpen(true);
      setAutoOpenDrawer(false);
    }
  }, [autoOpenDrawer]);

  const handleViewChanges = () => {
    setIsDrawerOpen(true);
    onViewChanges();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Access granted':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDataSourceIcon = (type: string) => {
    // In a real app, you'd use actual brand icons
    switch (type) {
      case 'Meta':
        return '📘';
      case 'Google Ads':
        return '🔍';
      case 'Amazon Advertising':
        return '📦';
      case 'Google Sheets':
        return '📊';
      case 'LinkedIn Ads':
        return '💼';
      case 'TikTok Ads':
        return '🎵';
      case 'Twitter Ads':
        return '🐦';
      default:
        return '🔗';
    }
  };

  // Sample datastreams for display
  const sampleDatastreams = [
    `${authorization.type}_CampaignStats`,
    `${authorization.type}_PerformanceData`,
    `${authorization.type}_AudienceInsights`,
    `${authorization.type}_ConversionTracking`
  ].slice(0, authorization.datastreamsCount);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center hover:text-blue-600 transition-colors"
        >
          <Home className="h-4 w-4 mr-1" />
          Testing
        </button>
        <ChevronRight className="h-4 w-4" />
        <button
          onClick={onNavigateToList}
          className="hover:text-blue-600 transition-colors"
        >
          Authorizations
        </button>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">{authorization.name}</span>
      </nav>

      {/* Authorization Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getDataSourceIcon(authorization.type)}</div>
                  <div>
                    <CardTitle className="text-xl">{authorization.name}</CardTitle>
                    <CardDescription>{authorization.type} Authorization</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(authorization.status)}>
                  {authorization.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Workspace:</span>
                  <span className="font-medium">{authorization.workspace}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="font-medium">{formatDateShort(authorization.created)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Last used:</span>
                  <span className="font-medium">
                    {authorization.lastUsed
                      ? formatRelativeTime(authorization.lastUsed)
                      : 'Never'
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Authorization ID:</span>
                  <span className="font-mono text-sm">{authorization.id}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {authorization.permissionsCount}
                    </div>
                    <div className="text-sm text-gray-600">Permissions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {authorization.datastreamsCount}
                    </div>
                    <div className="text-sm text-gray-600">Datastreams</div>
                  </div>
                </div>
                <Button onClick={handleViewChanges} className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>View changes</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Changes</CardTitle>
              <CardDescription>Latest permission modifications</CardDescription>
            </CardHeader>
            <CardContent>
              {recentChanges.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent changes
                </p>
              ) : (
                <div className="space-y-3">
                  {recentChanges.map((change) => (
                    <div key={change.id} className="flex items-start space-x-3 text-sm">
                      <Badge
                        variant={change.action === 'Added' ? 'default' : 'destructive'}
                        className={`text-xs ${
                          change.action === 'Added'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {change.action}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate" title={change.permissionName}>
                          {change.permissionName}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {formatRelativeTime(change.dateTime)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {permissionChanges.length > 5 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleViewChanges}
                      className="w-full"
                    >
                      View all {permissionChanges.length} changes
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Used by Datastreams */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Used by {authorization.datastreamsCount} Datastreams</CardTitle>
          <CardDescription>
            This authorization is currently being used by the following datastreams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sampleDatastreams.map((datastream, index) => (
              <button
                key={index}
                className="p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => console.log('Navigate to datastream:', datastream)}
              >
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">{datastream}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Active • Last run 2 hours ago
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </CardTitle>
          <CardDescription>
            Manage authorization settings and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Edit Authorization
            </Button>
            <Button variant="outline" className="justify-start">
              <Activity className="h-4 w-4 mr-2" />
              Refresh Permissions
            </Button>
            <Button variant="outline" className="justify-start">
              <Database className="h-4 w-4 mr-2" />
              Sync Metadata
            </Button>
            <Button variant="outline" className="justify-start">
              <Eye className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Drawer */}
      <PermissionsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        authorizationId={authorization.id}
        initialDateRange={drawerDateRange}
      />
    </div>
  );
};

export default AuthorizationDetail;