import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateForInput } from "@/utils/date-utils";
import {
  exportPermissionChangesToCSV,
  type ExportOptions,
} from "@/utils/csv-export";
import type { PermissionChange } from "@/data/types";
import { Download, Calendar, Filter } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissionChanges: PermissionChange[];
  title?: string;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  permissionChanges,
  title = "Export Permission Changes",
}) => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });
  const [includeAdded, setIncludeAdded] = useState(true);
  const [includeRemoved, setIncludeRemoved] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Calculate preview stats
  const previewData = permissionChanges.filter((change) => {
    // Date range filter
    if (change.dateTime < dateRange.from || change.dateTime > dateRange.to) {
      return false;
    }

    // Action filter
    if (!includeAdded && change.action === "Added") return false;
    if (!includeRemoved && change.action === "Removed") return false;

    return true;
  });

  const addedCount = previewData.filter((c) => c.action === "Added").length;
  const removedCount = previewData.filter((c) => c.action === "Removed").length;

  const handleExport = async () => {
    if (previewData.length === 0) return;

    setIsExporting(true);

    try {
      const exportOptions: ExportOptions = {
        includeAdded,
        includeRemoved,
        dateRange,
      };

      exportPermissionChangesToCSV(permissionChanges, exportOptions);

      // Close modal after successful export
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setDateRange({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    });
    setIncludeAdded(true);
    setIncludeRemoved(true);
  };

  const isValidExport =
    previewData.length > 0 && (includeAdded || includeRemoved);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>
            Configure your export settings and download permission changes as
            CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Range Selection */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Label className="font-medium">Date Range</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="from-date" className="text-sm text-gray-600">
                    From
                  </Label>
                  <Input
                    id="from-date"
                    type="date"
                    value={formatDateForInput(dateRange.from)}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        from: new Date(e.target.value),
                      }))
                    }
                    max={formatDateForInput(dateRange.to)}
                  />
                </div>
                <div>
                  <Label htmlFor="to-date" className="text-sm text-gray-600">
                    To
                  </Label>
                  <Input
                    id="to-date"
                    type="date"
                    value={formatDateForInput(dateRange.to)}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        to: new Date(e.target.value),
                      }))
                    }
                    min={formatDateForInput(dateRange.from)}
                    max={formatDateForInput(new Date())}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Filters */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2 mb-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <Label className="font-medium">Include Actions</Label>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-added"
                    checked={includeAdded}
                    onCheckedChange={(checked) => setIncludeAdded(!!checked)}
                  />
                  <Label
                    htmlFor="include-added"
                    className="text-sm cursor-pointer"
                  >
                    Added entities
                    <span className="text-gray-500 ml-1">
                      (
                      {
                        permissionChanges.filter((c) => c.action === "Added")
                          .length
                      }
                      )
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-removed"
                    checked={includeRemoved}
                    onCheckedChange={(checked) => setIncludeRemoved(!!checked)}
                  />
                  <Label
                    htmlFor="include-removed"
                    className="text-sm cursor-pointer"
                  >
                    Removed entities
                    <span className="text-gray-500 ml-1">
                      (
                      {
                        permissionChanges.filter((c) => c.action === "Removed")
                          .length
                      }
                      )
                    </span>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Preview */}
          <Card>
            <CardContent className="pt-4">
              <Label className="font-medium mb-3 block">Export Preview</Label>
              {previewData.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <div className="text-2xl mb-2">📄</div>
                  <p className="text-sm">No data matches your criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {addedCount}
                    </div>
                    <div className="text-xs text-gray-600">Added</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">
                      {removedCount}
                    </div>
                    <div className="text-xs text-gray-600">Removed</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {previewData.length}
                    </div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validation Message */}
          {!isValidExport && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              Please select at least one action type and ensure your date range
              includes data.
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={!isValidExport || isExporting}
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
