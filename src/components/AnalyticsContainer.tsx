import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { EntityChange } from "@/data/types";
import { formatDateForInput } from "@/utils/date-utils";
import { exportEntityChangesToCSV } from "@/utils/csv-export";
import DailyEntitiesChart from "./DailyEntitiesChart";
import TopDataSourcesChart from "./TopDataSourcesChart";
import { Download } from "lucide-react";

interface AnalyticsContainerProps {
  entityChanges: EntityChange[];
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (dateRange: { from: Date; to: Date }) => void;
  className?: string;
}

const AnalyticsContainer: React.FC<AnalyticsContainerProps> = ({
  entityChanges,
  dateRange,
  onDateRangeChange,
  className = "overflow-visible",
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
      {/* Date Range Controls */}
      <Card className="shadow-none border-none">
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
                className="text-sm"
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
                className="text-sm"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  const thirtyDaysAgo = new Date(
                    now.getTime() - 30 * 24 * 60 * 60 * 1000
                  );
                  onDateRangeChange({ from: thirtyDaysAgo, to: now });
                }}
                className="text-xs"
              >
                Last 30 days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  const ninetyDaysAgo = new Date(
                    now.getTime() - 90 * 24 * 60 * 60 * 1000
                  );
                  onDateRangeChange({ from: ninetyDaysAgo, to: now });
                }}
                className="text-xs"
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
