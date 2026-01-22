import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { EntityChange } from "@/data/types";
import { formatDateForInput } from "@/utils/date-utils";
import { exportEntityChangesToCSV } from "@/utils/csv-export";
import DailyEntitiesChart from "./DailyEntitiesChart";
import TopDataSourcesChart from "./TopDataSourcesChart";
import { Download, Lock } from "lucide-react";

interface AnalyticsContainerProps {
  entityChanges: EntityChange[];
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (dateRange: { from: Date; to: Date }) => void;
  className?: string;
  hasFeatureAccess: boolean;
  onFeatureRequest: () => void;
}

const AnalyticsContainer: React.FC<AnalyticsContainerProps> = ({
  entityChanges,
  dateRange,
  onDateRangeChange,
  className = "overflow-visible",
  hasFeatureAccess,
  onFeatureRequest,
}) => {
  const handleExportCSV = () => {
    exportEntityChangesToCSV(entityChanges, {
      includeAdded: true,
      includeRemoved: true,
      dateRange: dateRange,
    });
  };

  return (
    <div className={`${className} shadow rounded-lg`}>
      {/* Limited Access Banner */}
      {!hasFeatureAccess && (
        <div className="bg-blue-50 border border-blue-200 rounded-t-lg px-4 py-3 flex items-center gap-2">
          <Lock className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-blue-800">
            <span className="font-medium">Limited to last 7 days.</span>{" "}
            <button
              onClick={onFeatureRequest}
              className="underline hover:no-underline font-medium"
            >
              Request access
            </button>{" "}
            to view custom date ranges and full history.
          </p>
        </div>
      )}

      {/* Date Range Controls */}
      <Card className={`shadow-none border-none ${!hasFeatureAccess ? "rounded-t-none" : ""}`}>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Entity Changes</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
          <div className="gap-4 flex w-1/2">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">From</label>
              <Input
                type="date"
                value={formatDateForInput(dateRange.from)}
                onChange={(e) =>
                  onDateRangeChange({
                    ...dateRange,
                    from: new Date(e.target.value),
                  })
                }
                className={`text-sm ${!hasFeatureAccess ? "cursor-pointer" : ""}`}
                disabled={!hasFeatureAccess}
                onClick={!hasFeatureAccess ? onFeatureRequest : undefined}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">To</label>
              <Input
                type="date"
                value={formatDateForInput(dateRange.to)}
                onChange={(e) =>
                  onDateRangeChange({
                    ...dateRange,
                    to: new Date(e.target.value),
                  })
                }
                className={`text-sm ${!hasFeatureAccess ? "cursor-pointer" : ""}`}
                disabled={!hasFeatureAccess}
                onClick={!hasFeatureAccess ? onFeatureRequest : undefined}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={hasFeatureAccess ? () => {
                  const now = new Date();
                  const thirtyDaysAgo = new Date(
                    now.getTime() - 30 * 24 * 60 * 60 * 1000
                  );
                  onDateRangeChange({ from: thirtyDaysAgo, to: now });
                } : onFeatureRequest}
                disabled={!hasFeatureAccess}
                className={`text-xs ${!hasFeatureAccess ? "cursor-pointer" : ""}`}
              >
                Last 30 days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={hasFeatureAccess ? () => {
                  const now = new Date();
                  const ninetyDaysAgo = new Date(
                    now.getTime() - 90 * 24 * 60 * 60 * 1000
                  );
                  onDateRangeChange({ from: ninetyDaysAgo, to: now });
                } : onFeatureRequest}
                disabled={!hasFeatureAccess}
                className={`text-xs ${!hasFeatureAccess ? "cursor-pointer" : ""}`}
              >
                Last 90 days
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Daily View Chart - 3/5 width */}
        <DailyEntitiesChart
          className="lg:col-span-4 shadow-none border-none"
          entityChanges={entityChanges}
          dateRange={dateRange}
        />
        {/* Top Data Sources Chart - 2/5 width */}
        <TopDataSourcesChart
          className="lg:col-span-1 shadow-none border-none"
          entityChanges={entityChanges}
          dateRange={dateRange}
        />
      </div>
    </div>
  );
};

export default AnalyticsContainer;
