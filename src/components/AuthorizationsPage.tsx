import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AuthorizationsPageState } from "@/data/types";
import { authorizations, entityChanges } from "@/data/dummy-data";
import {
  formatDateShort,
  formatRelativeTime,
  getDateRange,
} from "@/utils/date-utils";
import { exportAuthorizationsToCSV } from "@/utils/csv-export";
import AnalyticsContainer from "./AnalyticsContainer";
import ExportModal from "./ExportModal";
import {
  Search,
  Download,
  Trash2,
  RefreshCw,
  Filter,
  ArrowUpDown,
} from "lucide-react";

interface AuthorizationsPageProps {
  onNavigateToDetail: (authId: string) => void;
}

const AuthorizationsPage: React.FC<AuthorizationsPageProps> = ({
  onNavigateToDetail,
}) => {
  const [state, setState] = useState<AuthorizationsPageState>({
    selectedItems: [],
    filters: {
      workspace: "all",
      dataSource: "all",
      status: "all",
    },
    searchTerm: "",
    sortBy: "created",
    sortOrder: "desc",
    chartDateRange: getDateRange(90),
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Get unique values for filters
  const workspaces = [...new Set(authorizations.map((auth) => auth.workspace))];
  const dataSources = [...new Set(authorizations.map((auth) => auth.type))];
  const statuses = [...new Set(authorizations.map((auth) => auth.status))];

  // Filter and sort authorizations
  const filteredAuthorizations = useMemo(() => {
    const filtered = authorizations.filter((auth) => {
      // Workspace filter
      if (
        state.filters.workspace !== "all" &&
        auth.workspace !== state.filters.workspace
      ) {
        return false;
      }

      // Data source filter
      if (
        state.filters.dataSource !== "all" &&
        auth.type !== state.filters.dataSource
      ) {
        return false;
      }

      // Status filter
      if (
        state.filters.status !== "all" &&
        auth.status !== state.filters.status
      ) {
        return false;
      }

      // Search filter
      if (state.searchTerm) {
        const searchLower = state.searchTerm.toLowerCase();
        return (
          auth.name.toLowerCase().includes(searchLower) ||
          auth.type.toLowerCase().includes(searchLower) ||
          auth.workspace.toLowerCase().includes(searchLower) ||
          auth.id.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (state.sortBy) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "type":
          aVal = a.type;
          bVal = b.type;
          break;
        case "workspace":
          aVal = a.workspace;
          bVal = b.workspace;
          break;
        case "created":
          aVal = a.created.getTime();
          bVal = b.created.getTime();
          break;
        case "lastUsed":
          aVal = a.lastUsed?.getTime() || 0;
          bVal = b.lastUsed?.getTime() || 0;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = a.created.getTime();
          bVal = b.created.getTime();
      }

      if (state.sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [state.filters, state.searchTerm, state.sortBy, state.sortOrder]);

  const handleSort = (field: string) => {
    setState((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    setState((prev) => ({
      ...prev,
      selectedItems: checked
        ? filteredAuthorizations.map((auth) => auth.id)
        : [],
    }));
  };

  const handleSelectItem = (authId: string, checked: boolean) => {
    setState((prev) => ({
      ...prev,
      selectedItems: checked
        ? [...prev.selectedItems, authId]
        : prev.selectedItems.filter((id) => id !== authId),
    }));
  };

  const handleBulkExport = () => {
    const selectedAuths = authorizations.filter((auth) =>
      state.selectedItems.includes(auth.id)
    );
    exportAuthorizationsToCSV(selectedAuths);
  };

  const handleChartDateRangeChange = (dateRange: { from: Date; to: Date }) => {
    setState((prev) => ({
      ...prev,
      chartDateRange: dateRange,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Connected":
        return "bg-green-100 text-green-800";
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-medium text-gray-900">Authorizations</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Grant Adverity access to data sources and destinations.
        </p>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsContainer
        className="z-20"
        entityChanges={entityChanges}
        dateRange={state.chartDateRange}
        onDateRangeChange={handleChartDateRangeChange}
      />

      <div className="flex-col">
        {/* Filters and Actions */}
        <Card className="sticky top-0 z-10 bg-gray-50 border-none shadow-none">
          {/* <CardHeader>
          <CardTitle className="text-lg">Filters & Actions</CardTitle>
        </CardHeader> */}
          <CardContent className="space-y-4 p-4">
            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                {/* <label className="block text-sm font-medium mb-1">
                  Workspace
                </label> */}
                <Select
                  value={state.filters.workspace}
                  onValueChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      filters: { ...prev.filters, workspace: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Workspaces</SelectItem>
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace} value={workspace}>
                        {workspace}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                {/* <label className="block text-sm font-medium mb-1">
                  Data Source
                </label> */}
                <Select
                  value={state.filters.dataSource}
                  onValueChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      filters: { ...prev.filters, dataSource: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {dataSources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                {/* <label className="block text-sm font-medium mb-1">Status</label> */}
                <Select
                  value={state.filters.status}
                  onValueChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      filters: { ...prev.filters, status: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                {/* <label className="block text-sm font-medium mb-1">Search</label> */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search authorizations..."
                    value={state.searchTerm}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        searchTerm: e.target.value,
                      }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex justify-between items-center pt-2 border-t">
              <div className="text-sm text-gray-600">
                {filteredAuthorizations.length} authorization
                {filteredAuthorizations.length !== 1 ? "s" : ""} found
                {state.selectedItems.length > 0 && (
                  <span className="ml-2">
                    • {state.selectedItems.length} selected
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {state.selectedItems.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkExport}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Entity Changes
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Metadata
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
                {/* <Button onClick={() => setIsExportModalOpen(true)} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authorizations Table */}
        <Card>
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        state.selectedItems.length ===
                          filteredAuthorizations.length &&
                        filteredAuthorizations.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("type")}
                      className="h-auto p-0 font-semibold"
                    >
                      Data source
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 font-semibold"
                    >
                      Authorization
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("workspace")}
                      className="h-auto p-0 font-semibold"
                    >
                      Workspace
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("created")}
                      className="h-auto p-0 font-semibold"
                    >
                      Created
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("lastUsed")}
                      className="h-auto p-0 font-semibold"
                    >
                      Last Used
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-xs">Entities</TableHead>
                  <TableHead className="text-xs">Datastreams</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("status")}
                      className="h-auto p-0 font-semibold"
                    >
                      Status
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuthorizations.map((auth) => (
                  <TableRow key={auth.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={state.selectedItems.includes(auth.id)}
                        onCheckedChange={(checked) =>
                          handleSelectItem(auth.id, !!checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 p-2">
                        {getDataSourceIcon(auth.type).endsWith(".svg") ? (
                          <img
                            src={getDataSourceIcon(auth.type)}
                            alt={auth.type}
                            className="w-5 h-5"
                          />
                        ) : (
                          <span className="text-lg">
                            {getDataSourceIcon(auth.type)}
                          </span>
                        )}
                        <span className="text-sm font-medium">{auth.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => onNavigateToDetail(auth.id)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-left"
                      >
                        {auth.name}
                      </button>
                    </TableCell>
                    <TableCell>{auth.workspace}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDateShort(auth.created)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {auth.lastUsed
                        ? formatRelativeTime(auth.lastUsed)
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{auth.entitiesCount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {auth.datastreamsCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(auth.status)}>
                        {auth.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAuthorizations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Filter className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No authorizations found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        entityChanges={entityChanges}
        title="Export Entity Changes"
      />
    </div>
  );
};

export default AuthorizationsPage;
