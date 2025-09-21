import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EmailNotificationProps } from "@/data/types";
import { authorizations } from "@/data/dummy-data";
import { Mail, Clock } from "lucide-react";

const EmailNotification: React.FC<EmailNotificationProps> = ({
  entityChanges,
  onSeeDetails,
}) => {
  // Sort entity changes: Removed first, then Added, with most recent first within each group
  const sortedEntityChanges = [...entityChanges].sort((a, b) => {
    // Primary sort: Removed comes before Added
    if (a.action !== b.action) {
      return a.action === "Removed" ? -1 : 1;
    }
    // Secondary sort: Most recent first within same action
    return b.dateTime.getTime() - a.dateTime.getTime();
  });

  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Email Header */}
      <div className="pb-4">
        <div className="flex items-center gap-2 mb-8">
          <Mail className="h-5 w-5" />
          <span className="text-sm text-gray-600">
            notifications@adverity.com
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Entities Changes Summary
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Today, 07:00</span>
        </div>
      </div>

      {/* Email Content */}
      <div className="space-y-6">
        {/* Entity Changes Summary */}
        <Card>
          <CardHeader>
            <CardTitle>
              {entityChanges.length} entity changes detected in the last 24
              hours
            </CardTitle>
            {/* <CardDescription>
              {entityChanges.length} entity changes detected in the last
              24 hours
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="text-xs">
                <TableRow>
                  <TableHead>Authorization</TableHead>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Data Source</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Entity Name</TableHead>
                  {/* <TableHead>Time</TableHead> */}
                  <TableHead>Used in Datastreams</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEntityChanges.slice(0, 10).map((change) => {
                  // Find the authorization name by authorizationId
                  const authorization = authorizations.find(
                    (auth) => auth.id === change.authorizationId
                  );
                  const authorizationName = authorization
                    ? authorization.name
                    : change.authorizationId
                        .replace("auth-", "")
                        .replace(/-/g, " ");

                  return (
                    <TableRow key={change.id} className="text-gray-500">
                      <TableCell className="font-medium text-black">
                        {authorizationName}
                      </TableCell>
                      <TableCell>{change.workspace}</TableCell>
                      <TableCell>{change.dataSource}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            change.action === "Added"
                              ? "default"
                              : "destructive"
                          }
                          className={
                            change.action === "Added"
                              ? "bg-gray-50 text-gray-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {change.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-black">
                        {change.entityName}
                      </TableCell>
                      {/* <TableCell className="text-sm text-gray-600">
                      {formatDate(change.dateTime)}
                    </TableCell> */}
                      <TableCell>
                        <span className="text-sm font-medium">
                          {change.usedInDatastreams}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onSeeDetails(change.authorizationId, {
                              from: yesterday,
                              to: today,
                            })
                          }
                        >
                          See details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {sortedEntityChanges.length > 10 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  Showing first 10 of {sortedEntityChanges.length} changes.{" "}
                  <button
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => {
                      const firstChangeAuth =
                        sortedEntityChanges[0]?.authorizationId;
                      if (firstChangeAuth) {
                        onSeeDetails(firstChangeAuth, {
                          from: yesterday,
                          to: today,
                        });
                      }
                    }}
                  >
                    View all changes
                  </button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {entityChanges.filter((c) => c.action === "Added").length}
              </div>
              <div className="text-sm text-gray-600">Entities Added</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {entityChanges.filter((c) => c.action === "Removed").length}
              </div>
              <div className="text-sm text-gray-600">Entities Removed</div>
            </CardContent>
          </Card> */}
          {/* <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {authorizations.length}
              </div>
              <div className="text-sm text-gray-600">
                Authorizations Affected
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Email Footer */}
        <div className="mt-8 pt-6 text-sm text-gray-500">
          <p className="mt-2">
            Update your email preferences or unsubscribe {""}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailNotification;
