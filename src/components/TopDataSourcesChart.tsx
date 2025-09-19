import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PermissionChange } from "@/data/types";
import { isWithinInterval } from "date-fns";

interface TopDataSourcesChartProps {
  permissionChanges: PermissionChange[];
  dateRange: { from: Date; to: Date };
  className?: string;
}

interface DataSourceStats {
  name: string;
  total: number;
  added: number;
  removed: number;
  percentage: number;
  color: string;
}

const TopDataSourcesChart: React.FC<TopDataSourcesChartProps> = ({
  permissionChanges,
  dateRange,
  className = "",
}) => {
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

  const dataSourceColors = {
    Meta: "#1877F2",
    "Google Ads": "#4285F4",
    "Amazon Advertising": "#FF9900",
    "Google Sheets": "#34A853",
    "LinkedIn Ads": "#0A66C2",
    "TikTok Ads": "#000000",
    "Twitter Ads": "#1DA1F2",
  };

  const chartData = useMemo(() => {
    // Filter changes within date range
    const filteredChanges = permissionChanges.filter((change) =>
      isWithinInterval(change.dateTime, {
        start: dateRange.from,
        end: dateRange.to,
      })
    );

    // Group by data source
    const dataSourceGroups: { [key: string]: DataSourceStats } = {};

    filteredChanges.forEach((change) => {
      const dataSource = change.dataSource;
      if (!dataSourceGroups[dataSource]) {
        dataSourceGroups[dataSource] = {
          name: dataSource,
          total: 0,
          added: 0,
          removed: 0,
          percentage: 0,
          color:
            dataSourceColors[dataSource as keyof typeof dataSourceColors] ||
            "#6B7280",
        };
      }

      dataSourceGroups[dataSource].total++;
      if (change.action === "Added") {
        dataSourceGroups[dataSource].added++;
      } else {
        dataSourceGroups[dataSource].removed++;
      }
    });

    const totalChanges = filteredChanges.length;
    const data = Object.values(dataSourceGroups)
      .map((item) => ({
        ...item,
        percentage:
          totalChanges > 0 ? Math.round((item.total / totalChanges) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    return data;
  }, [permissionChanges, dateRange]);

  const totalChanges = chartData.reduce((sum, item) => sum + item.total, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DataSourceStats;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-[9999] relative">
          <div className="flex items-center space-x-2 mb-2">
            {getDataSourceIcon(data.name).endsWith(".svg") ? (
              <img
                src={getDataSourceIcon(data.name)}
                alt={data.name}
                className="w-4 h-4"
              />
            ) : (
              <span className="text-sm">{getDataSourceIcon(data.name)}</span>
            )}
            <span className="font-semibold text-gray-900 text-sm">
              {data.name}
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">All changes:</span>
              <span className="font-medium">{data.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Added:</span>
              <span className="font-medium">{data.added}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-600">Removed:</span>
              <span className="font-medium">{data.removed}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="text-gray-600">Percentage:</span>
              <span className="font-medium">{data.percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-gray-500 font-normal">
          By data source
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalChanges === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>No permission changes in selected date range</p>
            </div>
          </div>
        ) : (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  className="opacity-80"
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="total"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopDataSourcesChart;
