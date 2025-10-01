import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { EntityChange } from "@/data/types";
import { format, startOfDay, addDays, isWithinInterval } from "date-fns";
import { formatDateForInput } from "@/utils/date-utils";
import { authorizations } from "@/data/dummy-data";
import TopDataSourcesChart from "./TopDataSourcesChart";

interface EntitiesChartProps {
  entityChanges: EntityChange[];
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (dateRange: { from: Date; to: Date }) => void;
  className?: string;
}

interface AuthorizationChange {
  authId: string;
  authName: string;
  authType: string;
  count: number;
}

interface ChartDataPoint {
  date: string;
  added: number;
  removed: number;
  total: number;
  addedAuthorizations: AuthorizationChange[];
  removedAuthorizations: AuthorizationChange[];
}

const EntitiesChart: React.FC<EntitiesChartProps> = ({
  entityChanges,
  dateRange,
  onDateRangeChange,
  className = "overflow-visible",
}) => {
  const chartData = useMemo(() => {
    const data: ChartDataPoint[] = [];
    const startDate = startOfDay(dateRange.from);
    const endDate = startOfDay(dateRange.to);

    // Create a data point for each day in the range
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const dayStart = currentDate;
      const dayEnd = addDays(currentDate, 1);

      // Filter changes for this day
      const dayChanges = entityChanges.filter((change) =>
        isWithinInterval(change.dateTime, { start: dayStart, end: dayEnd })
      );

      const addedChanges = dayChanges.filter((c) => c.action === "Added");
      const removedChanges = dayChanges.filter((c) => c.action === "Removed");

      // Group by authorization and count changes
      const groupChangesByAuth = (changes: EntityChange[]) => {
        const authGroups: { [authId: string]: AuthorizationChange } = {};

        changes.forEach((change) => {
          const auth = authorizations.find(
            (a) => a.id === change.authorizationId
          );
          if (auth) {
            if (!authGroups[auth.id]) {
              authGroups[auth.id] = {
                authId: auth.id,
                authName: auth.name,
                authType: auth.type,
                count: 0,
              };
            }
            authGroups[auth.id].count++;
          }
        });

        return Object.values(authGroups).sort((a, b) => b.count - a.count);
      };

      const addedAuthorizations = groupChangesByAuth(addedChanges);
      const removedAuthorizations = groupChangesByAuth(removedChanges);

      data.push({
        date: format(currentDate, "MMM d"),
        added: addedChanges.length,
        removed: removedChanges.length,
        total: addedChanges.length + removedChanges.length,
        addedAuthorizations,
        removedAuthorizations,
      });

      currentDate = addDays(currentDate, 1);
    }

    return data;
  }, [entityChanges, dateRange]);

  const totalAdded = chartData.reduce((sum, day) => sum + day.added, 0);
  const totalRemoved = chartData.reduce((sum, day) => sum + day.removed, 0);
  const maxValue = Math.max(...chartData.map((d) => d.total));

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload as ChartDataPoint;

      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-xs z-[9999] relative">
          <p className="font-semibold text-gray-900 text-sm mb-2">{label}</p>

          {/* Added Section */}
          {data.added > 0 && (
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded bg-blue-400" />
                <span className="text-sm font-medium text-gray-700">
                  Added ({data.added}):
                </span>
              </div>
              <div className="space-y-1 ml-5">
                {data.addedAuthorizations.slice(0, 5).map((auth, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 text-xs"
                  >
                    {getDataSourceIcon(auth.authType).endsWith(".svg") ? (
                      <img
                        src={getDataSourceIcon(auth.authType)}
                        alt={auth.authType}
                        className="w-3 h-3"
                      />
                    ) : (
                      <span className="text-xs">
                        {getDataSourceIcon(auth.authType)}
                      </span>
                    )}
                    <span className="text-gray-600 truncate">
                      {auth.authName}: +{auth.count} entity
                      {auth.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
                {data.addedAuthorizations.length > 5 && (
                  <div className="text-xs text-gray-500 ml-5">
                    +{data.addedAuthorizations.length - 5} more authorization
                    {data.addedAuthorizations.length - 5 !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Removed Section */}
          {data.removed > 0 && (
            <div className="mb-2">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded bg-yellow-600" />
                <span className="text-sm font-medium text-gray-700">
                  Removed ({data.removed}):
                </span>
              </div>
              <div className="space-y-1 ml-5">
                {data.removedAuthorizations.slice(0, 5).map((auth, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 text-xs"
                  >
                    {getDataSourceIcon(auth.authType).endsWith(".svg") ? (
                      <img
                        src={getDataSourceIcon(auth.authType)}
                        alt={auth.authType}
                        className="w-3 h-3"
                      />
                    ) : (
                      <span className="text-xs">
                        {getDataSourceIcon(auth.authType)}
                      </span>
                    )}
                    <span className="text-gray-600 truncate">
                      {auth.authName}: -{auth.count} entity
                      {auth.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
                {data.removedAuthorizations.length > 5 && (
                  <div className="text-xs text-gray-500 ml-5">
                    +{data.removedAuthorizations.length - 5} more authorization
                    {data.removedAuthorizations.length - 5 !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No changes message */}
          {data.removed === 0 && data.added === 0 && (
            <p className="text-xs text-gray-500">(no changes)</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${className} overflow-visible space-y-6`}>
      {/* Date Range Picker */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Entity Changes Analytics</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
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
            <div>
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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Daily View Chart - 3/5 width */}
        <Card className="lg:col-span-3 overflow-visible">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  Daily view of entity changes
                </CardTitle>
              </div>
              <div className="grid grid-cols-2 gap-4 text-right">
                <div>
                  <div className="text-lg font-bold text-blue-400">
                    {totalAdded}
                  </div>
                  <div className="text-xs text-gray-600">Added</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-600">
                    {totalRemoved}
                  </div>
                  <div className="text-xs text-gray-600">Removed</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-visible">
            <div className="h-40 w-full overflow-visible">
              {chartData.length === 0 || maxValue === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p>No entity changes in selected date range</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#e0e0e0" }}
                      axisLine={{ stroke: "#e0e0e0" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#e0e0e0" }}
                      axisLine={{ stroke: "#e0e0e0" }}
                      domain={[0, maxValue]}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                    />
                    <Bar
                      dataKey="added"
                      stackId="a"
                      fill="var(--chart-1)"
                      name="Added"
                      radius={[0, 0, 4, 4]}
                    />
                    <Bar
                      dataKey="removed"
                      stackId="a"
                      fill="var(--chart-5)"
                      name="Removed"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Data Sources Chart - 2/5 width */}
        <TopDataSourcesChart
          className="lg:col-span-2"
          entityChanges={entityChanges}
          dateRange={dateRange}
        />
      </div>
    </div>
  );
};

export default EntitiesChart;
