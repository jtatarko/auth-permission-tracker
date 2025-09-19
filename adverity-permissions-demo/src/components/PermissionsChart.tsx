import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { PermissionChange } from '@/data/types';
import { format, startOfDay, addDays, isWithinInterval } from 'date-fns';
import { formatDateForInput } from '@/utils/date-utils';
import { Calendar } from 'lucide-react';

interface PermissionsChartProps {
  permissionChanges: PermissionChange[];
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (dateRange: { from: Date; to: Date }) => void;
  className?: string;
}

interface ChartDataPoint {
  date: string;
  added: number;
  removed: number;
  total: number;
}

const PermissionsChart: React.FC<PermissionsChartProps> = ({
  permissionChanges,
  dateRange,
  onDateRangeChange,
  className = ''
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
      const dayChanges = permissionChanges.filter(change =>
        isWithinInterval(change.dateTime, { start: dayStart, end: dayEnd })
      );

      const added = dayChanges.filter(c => c.action === 'Added').length;
      const removed = dayChanges.filter(c => c.action === 'Removed').length;

      data.push({
        date: format(currentDate, 'MMM d'),
        added,
        removed,
        total: added + removed
      });

      currentDate = addDays(currentDate, 1);
    }

    return data;
  }, [permissionChanges, dateRange]);

  const totalAdded = chartData.reduce((sum, day) => sum + day.added, 0);
  const totalRemoved = chartData.reduce((sum, day) => sum + day.removed, 0);
  const maxValue = Math.max(...chartData.map(d => d.total));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any) => (
              <div key={entry.dataKey} className="flex items-center space-x-2 text-sm">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600 capitalize">{entry.dataKey}:</span>
                <span className="font-medium">{entry.value}</span>
              </div>
            ))}
            <div className="border-t pt-1 mt-1">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <span className="text-gray-600">Total:</span>
                <span>{payload[0]?.payload?.total || 0}</span>
              </div>
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
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Permission Changes Over Time</CardTitle>
            <CardDescription>
              Daily view of permission additions and removals
            </CardDescription>
          </div>
          <div className="grid grid-cols-2 gap-4 text-right">
            <div>
              <div className="text-lg font-bold text-blue-600">{totalAdded}</div>
              <div className="text-xs text-gray-600">Added</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">{totalRemoved}</div>
              <div className="text-xs text-gray-600">Removed</div>
            </div>
          </div>
        </div>

        {/* Date Range Picker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <Input
              type="date"
              value={formatDateForInput(dateRange.from)}
              onChange={(e) =>
                onDateRangeChange({
                  ...dateRange,
                  from: new Date(e.target.value)
                })
              }
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <Input
              type="date"
              value={formatDateForInput(dateRange.to)}
              onChange={(e) =>
                onDateRangeChange({
                  ...dateRange,
                  to: new Date(e.target.value)
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
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
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
                const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                onDateRangeChange({ from: ninetyDaysAgo, to: now });
              }}
              className="text-xs"
            >
              Last 90 days
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          {chartData.length === 0 || maxValue === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>No permission changes in selected date range</p>
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
                  tickLine={{ stroke: '#e0e0e0' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                  domain={[0, maxValue]}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '14px'
                  }}
                />
                <Bar
                  dataKey="added"
                  stackId="a"
                  fill="#3b82f6"
                  name="Added"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="removed"
                  stackId="a"
                  fill="#eab308"
                  name="Removed"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Summary stats */}
        <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {totalAdded + totalRemoved}
            </div>
            <div className="text-sm text-gray-600">Total Changes</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {Math.round(((totalAdded + totalRemoved) / chartData.length) * 10) / 10}
            </div>
            <div className="text-sm text-gray-600">Avg per Day</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {maxValue}
            </div>
            <div className="text-sm text-gray-600">Peak Day</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsChart;