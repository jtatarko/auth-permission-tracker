import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AuthorizationDetailProps } from "@/data/types";
import { formatDateShort, formatRelativeTime } from "@/utils/date-utils";
import { getEntityChangesForAuth } from "@/data/dummy-data";
import EntitiesDrawer from "./EntitiesDrawer";
import { ChevronRight } from "lucide-react";

const AuthorizationDetail: React.FC<AuthorizationDetailProps> = ({
  authorization,
  onViewChanges,
  onNavigateToList,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [autoOpenDrawer, setAutoOpenDrawer] = useState(false);
  const [drawerDateRange] = useState<{ from: Date; to: Date } | undefined>();

  // Get entity changes for this authorization
  const entityChanges = getEntityChangesForAuth(authorization.id);
  const recentChanges = entityChanges.slice(0, 5);

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
      case "Connected":
        return "bg-green-50 text-green-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDataSourceIcon = (type: string) => {
    switch (type) {
      case "Meta":
        return "/logos/meta-symbol.svg";
      case "Google Ads":
        return "/logos/google-ads-symbol.svg";
      case "Amazon Advertising":
        return "/logos/amazon-symbol.svg";
      case "Google Sheets":
        return "/logos/google-sheets-symbol.svg";
      case "LinkedIn Ads":
        return "/logos/linkedin-symbol.svg";
      case "TikTok Ads":
        return "/logos/tiktok-symbol.svg";
      case "Twitter Ads":
        return "/logos/twitter-x-symbol.svg";
      default:
        return "🔗";
    }
  };

  // Sample datastreams for display
  const sampleDatastreams = [
    `${authorization.type}_CampaignStats`,
    `${authorization.type}_Performance`,
    `${authorization.type}_AudienceInsights`,
    `${authorization.type}_Conversions`,
  ].slice(0, authorization.datastreamsCount);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center hover:text-blue-600 transition-colors"
        >
          {/* <Home className="h-4 w-4 mr-1" /> */}
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
      <div className="flex gap-4">
        <div>
          <Card className="border-b">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex gap-2">
                  {getDataSourceIcon(authorization.type).endsWith(".svg") ? (
                    <img
                      src={getDataSourceIcon(authorization.type)}
                      alt={authorization.type}
                      className="w-8 h-8"
                    />
                  ) : (
                    <div className="text-2xl">
                      {getDataSourceIcon(authorization.type)}
                    </div>
                  )}
                  <div className="pr-4">
                    <CardTitle className="text-xl">
                      {authorization.name}
                    </CardTitle>
                    {/* <CardDescription>
                      {authorization.type} Authorization
                    </CardDescription> */}
                  </div>
                </div>
                <Badge className={getStatusColor(authorization.status)}>
                  {authorization.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  {/* <Database className="h-4 w-4 text-gray-500" /> */}
                  <span className="text-sm text-gray-600">ID</span>
                  <span className="font-mono text-sm">{authorization.id}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {/* <Users className="h-4 w-4 text-gray-500" /> */}
                  <span className="text-sm text-gray-600">Workspace</span>
                  <span className="font-medium">{authorization.workspace}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {/* <Calendar className="h-4 w-4 text-gray-500" /> */}
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="font-medium">
                    {formatDateShort(authorization.created)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {/* <Activity className="h-4 w-4 text-gray-500" /> */}
                  <span className="text-sm text-gray-600">Last edited</span>
                  <span className="font-medium">
                    {authorization.lastUsed
                      ? formatRelativeTime(authorization.lastUsed)
                      : "Never"}
                  </span>
                </div>
              </div>

              {/* <Separator /> */}

              {/* <div className="flex justify-between items-center">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {authorization.entitiesCount}
                    </div>
                    <div className="text-sm text-gray-600">Entities</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {authorization.datastreamsCount}
                    </div>
                    <div className="text-sm text-gray-600">Datastreams</div>
                  </div>
                </div>
              </div> */}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-b">
            <CardHeader>
              <CardTitle className="text-md">Latest entity changes</CardTitle>
              {/* <CardDescription>Latest entity modifications</CardDescription> */}
            </CardHeader>
            <CardContent>
              {recentChanges.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent changes
                </p>
              ) : (
                <div className="space-y-1">
                  {recentChanges.map((change) => (
                    <div
                      key={change.id}
                      className="flex items-start space-x-3 text-sm p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-gray-900 truncate"
                          title={change.entityName}
                        >
                          {change.entityName}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {formatRelativeTime(change.dateTime)}
                        </p>
                      </div>
                      <div className="w-24">
                        <Badge
                          variant={
                            change.action === "Added"
                              ? "default"
                              : "destructive"
                          }
                          className={`text-xs h-4 ${
                            change.action === "Added"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {change.action}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {/* {entityChanges.length > 5 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleViewChanges}
                      className="w-full"
                    >
                      View all {entityChanges.length} changes
                    </Button>
                  )} */}
                </div>
              )}
              <Button
                size="sm"
                onClick={handleViewChanges}
                className="w-full flex items-center space-x-2 mt-4"
              >
                {/* <Eye className="h-4 w-4" /> */}
                <span>View details</span>
              </Button>
            </CardContent>
          </Card>

          {/* Current Perms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Provide access to</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <div className="p-2 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-800">
                  Ads Budget Management 301
                </p>
              </div>
              <div className="p-2 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-800">Reporting API Access 01</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-800">
                  Ads Creative Management 22
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Used by Datastreams */}
        <Card className="w-2/3">
          <CardHeader>
            <CardTitle className="text-md">
              Used by {sampleDatastreams.length} Datastreams
            </CardTitle>
            {/* <CardDescription>
            This authorization is currently being used by the following
            datastreams
          </CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {sampleDatastreams.map((datastream, index) => (
                <button
                  key={index}
                  className="flex justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition-colors bg-blue-50"
                  onClick={() =>
                    console.log("Navigate to datastream:", datastream)
                  }
                >
                  <div className="flex items-center space-x-2">
                    {/* <Database className="h-4 w-4 text-blue-600" /> */}
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
      </div>

      {/* Settings */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </CardTitle>
          <CardDescription>
            Manage authorization settings and entities
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
              Refresh Entities
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
      </Card> */}

      {/* Entities Drawer */}
      <EntitiesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        authorizationId={authorization.id}
        initialDateRange={drawerDateRange}
      />
    </div>
  );
};

export default AuthorizationDetail;
