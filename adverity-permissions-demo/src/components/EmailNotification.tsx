import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { formatDate } from "@/utils/date-utils";
import { Mail, Clock } from "lucide-react";

const EmailNotification: React.FC<EmailNotificationProps> = ({
  permissionChanges,
  onSeeDetails,
}) => {
  // Group changes by authorization
  const changesByAuth = permissionChanges.reduce((acc, change) => {
    if (!acc[change.authorizationId]) {
      acc[change.authorizationId] = [];
    }
    acc[change.authorizationId].push(change);
    return acc;
  }, {} as Record<string, typeof permissionChanges>);

  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Email Header */}
      <div className="border-b pb-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-gray-600">
            notifications@adverity.com
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Permissions Changes Summary
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {formatDate(today)} • Daily Report
          </span>
        </div>
      </div>

      {/* Email Content */}
      <div className="space-y-6">
        <div>
          <p className="text-gray-700 mb-4">
            Here's your daily summary of permission changes across your Adverity
            authorizations:
          </p>
        </div>

        {/* Permission Changes Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Permission Changes Summary
            </CardTitle>
            <CardDescription>
              {permissionChanges.length} permission changes detected in the last
              24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Authorization</TableHead>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Data Source</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Permission</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Used in Datastreams</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionChanges.slice(0, 10).map((change) => (
                  <TableRow key={change.id}>
                    <TableCell className="font-medium">
                      {change.authorizationId
                        .replace("auth-", "")
                        .replace(/-/g, " ")
                        .toUpperCase()}
                    </TableCell>
                    <TableCell>{change.workspace}</TableCell>
                    <TableCell>{change.dataSource}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          change.action === "Added" ? "default" : "destructive"
                        }
                        className={
                          change.action === "Added"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }
                      >
                        {change.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {change.permissionName}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(change.dateTime)}
                    </TableCell>
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
                ))}
              </TableBody>
            </Table>

            {permissionChanges.length > 10 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  Showing first 10 of {permissionChanges.length} changes.{" "}
                  <button
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => {
                      const firstChangeAuth =
                        permissionChanges[0]?.authorizationId;
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
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {permissionChanges.filter((c) => c.action === "Added").length}
              </div>
              <div className="text-sm text-gray-600">Permissions Added</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {permissionChanges.filter((c) => c.action === "Removed").length}
              </div>
              <div className="text-sm text-gray-600">Permissions Removed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(changesByAuth).length}
              </div>
              <div className="text-sm text-gray-600">
                Authorizations Affected
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Footer */}
        <div className="mt-8 pt-6 border-t text-sm text-gray-500">
          <p>
            This is an automated daily summary from Adverity. To view detailed
            permission changes, click on "See details" for any authorization
            above.
          </p>
          <p className="mt-2">
            Questions? Contact support at{" "}
            <a
              href="mailto:support@adverity.com"
              className="text-blue-600 hover:text-blue-700"
            >
              support@adverity.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailNotification;
