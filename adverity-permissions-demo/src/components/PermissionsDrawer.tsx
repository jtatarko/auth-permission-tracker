import React, { useState, useEffect, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import type { PermissionsDrawerProps } from "@/data/types";
import { getPermissionChangesForAuth } from "@/data/dummy-data";
import {
  formatDateTime,
  formatDateForInput,
  isDateInRange,
} from "@/utils/date-utils";
import { exportPermissionChangesToCSV } from "@/utils/csv-export";
import { Search, Download, Calendar, ArrowUpDown } from "lucide-react";

const PermissionsDrawer: React.FC<PermissionsDrawerProps> = ({
  isOpen,
  onClose,
  authorizationId,
  initialDateRange,
  initialFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<"All" | "Added" | "Removed">(
    initialFilters?.action || "All"
  );
  const [dateRange, setDateRange] = useState(
    initialDateRange || {
      from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      to: new Date(),
    }
  );
  const [sortBy, setSortBy] = useState<
    "dateTime" | "action" | "permissionName"
  >("dateTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Get permission changes for this authorization
  const allPermissionChanges = getPermissionChangesForAuth(authorizationId);

  // Filter and sort permission changes
  const filteredChanges = useMemo(() => {
    let filtered = allPermissionChanges.filter((change) => {
      // Date range filter
      if (!isDateInRange(change.dateTime, dateRange)) return false;

      // Action filter
      if (actionFilter !== "All" && change.action !== actionFilter)
        return false;

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          change.permissionName.toLowerCase().includes(searchLower) ||
          change.id.toLowerCase().includes(searchLower) ||
          change.datastreamNames.some((name) =>
            name.toLowerCase().includes(searchLower)
          )
        );
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortBy) {
        case "dateTime":
          aVal = a.dateTime.getTime();
          bVal = b.dateTime.getTime();
          break;
        case "action":
          aVal = a.action;
          bVal = b.action;
          break;
        case "permissionName":
          aVal = a.permissionName.toLowerCase();
          bVal = b.permissionName.toLowerCase();
          break;
        default:
          aVal = a.dateTime.getTime();
          bVal = b.dateTime.getTime();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [
    allPermissionChanges,
    dateRange,
    actionFilter,
    searchTerm,
    sortBy,
    sortOrder,
  ]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleExport = () => {
    exportPermissionChangesToCSV(filteredChanges, {
      includeAdded: actionFilter === "All" || actionFilter === "Added",
      includeRemoved: actionFilter === "All" || actionFilter === "Removed",
      dateRange,
    });
  };

  const handleDatastreamClick = (datastreamName: string) => {
    // In a real app, this would navigate to the datastream details
    console.log("Navigate to datastream:", datastreamName);
  };

  // Reset filters when drawer opens with new auth or initial filters
  useEffect(() => {
    if (isOpen) {
      setActionFilter(initialFilters?.action || "All");
      if (initialDateRange) {
        setDateRange(initialDateRange);
      }
    }
  }, [isOpen, authorizationId, initialFilters, initialDateRange]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div>
            <SheetTitle className="text-xl">
              History of Permission Changes
            </SheetTitle>
            <SheetDescription>for the authorization</SheetDescription>
          </div>

          {/* Filters */}
          <div className="space-y-4 border-b pb-4">
            {/* Date Range */}
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  From Date
                </label>
                <Input
                  type="date"
                  value={formatDateForInput(dateRange.from)}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      from: new Date(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  To Date
                </label>
                <Input
                  type="date"
                  value={formatDateForInput(dateRange.to)}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      to: new Date(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="min-w-40">
                <label className="block text-sm font-medium mb-1">Action</label>
                <Select
                  value={actionFilter}
                  onValueChange={(value: any) => setActionFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Actions</SelectItem>
                    <SelectItem value="Added">Added Only</SelectItem>
                    <SelectItem value="Removed">Removed Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-grow w-full">
                <label className="block text-sm font-medium mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search permissions, IDs, or datastreams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Results summary and export */}
            <div className="flex justify-between items-center pt-2">
              <div className="text-sm text-gray-600">
                {filteredChanges.length} permission changes found
              </div>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Permission Changes Table */}
        <div className="mt-6">
          {filteredChanges.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No permission changes found for the selected criteria.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("dateTime")}
                      className="h-auto p-0 font-semibold"
                    >
                      Date & Time
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("action")}
                      className="h-auto p-0 font-semibold"
                    >
                      Action
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("permissionName")}
                      className="h-auto p-0 font-semibold"
                    >
                      Permission Name
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-xs">Perm ID</TableHead>
                  <TableHead className="text-xs">Used in Datastreams</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChanges.map((change) => (
                  <TableRow key={change.id}>
                    <TableCell className="font-mono text-sm">
                      {formatDateTime(change.dateTime)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          change.action === "Added" ? "default" : "destructive"
                        }
                        className={
                          change.action === "Added"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {change.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={change.permissionName}>
                        {change.permissionName}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">
                      {change.id}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {change.usedInDatastreams} datastream
                          {change.usedInDatastreams !== 1 ? "s" : ""}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {change.datastreamNames
                            .slice(0, 2)
                            .map((name, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleDatastreamClick(name)}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                              >
                                {name}
                              </button>
                            ))}
                          {change.datastreamNames.length > 2 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{change.datastreamNames.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PermissionsDrawer;
