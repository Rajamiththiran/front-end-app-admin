import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Overview chart component for dashboard
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data
 * @param {string} props.title - Chart title
 * @param {Array} props.lines - Array of line definitions (name, key, color)
 * @param {Array} props.bars - Array of bar definitions (name, key, color)
 * @param {string} props.xAxisKey - Key for X-axis data
 * @param {boolean} props.loading - Whether the chart is in loading state
 * @param {string} props.type - Chart type: 'line', 'bar', or 'combo'
 * @param {boolean} props.allowTypeToggle - Whether to allow toggling between chart types
 * @param {string} props.tooltipFormatter - Function to format tooltip values
 * @param {string} props.yAxisFormatter - Function to format Y-axis labels
 * @param {Object} props.timeRanges - Object with time range options and their data
 */
const OverviewChart = ({
  data = [],
  title = "Overview",
  lines = [],
  bars = [],
  xAxisKey = "name",
  loading = false,
  type: initialType = "line",
  allowTypeToggle = true,
  tooltipFormatter,
  yAxisFormatter,
  timeRanges = null,
}) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState(initialType);
  const [timeRange, setTimeRange] = useState(
    timeRanges ? Object.keys(timeRanges)[0] : null
  );

  // Use timeRange data if provided, otherwise use the data prop
  const chartData = timeRanges && timeRange ? timeRanges[timeRange].data : data;

  // Custom tooltip formatter
  const defaultTooltipFormatter = (value) =>
    typeof value === "number" ? value.toLocaleString() : value;

  const formatter = tooltipFormatter || defaultTooltipFormatter;

  // Calculate height for loading placeholder
  const calculateHeight = () => {
    // The same height used in ResponsiveContainer
    return 300;
  };

  // Get chart component based on type
  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={yAxisFormatter}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            />
            <Tooltip
              formatter={formatter}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[3],
              }}
            />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            {bars.map((bar) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                name={bar.name}
                fill={bar.color}
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            ))}
          </BarChart>
        );

      case "combo":
        return (
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={yAxisFormatter}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            />
            <Tooltip
              formatter={formatter}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[3],
              }}
            />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            {bars.map((bar) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                name={bar.name}
                fill={bar.color}
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            ))}
            {lines.map((line) => (
              <Line
                key={line.key}
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={3}
                dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                type="monotone"
              />
            ))}
          </BarChart>
        );

      case "line":
      default:
        return (
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={yAxisFormatter}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            />
            <Tooltip
              formatter={formatter}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[3],
              }}
            />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            {lines.map((line) => (
              <Line
                key={line.key}
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={3}
                dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                type="monotone"
              />
            ))}
          </LineChart>
        );
    }
  };

  // Handle chart type change
  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <Card className="h-full">
      <CardContent>
        <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <Typography variant="h6" className="font-semibold mb-2 sm:mb-0">
            {title}
          </Typography>

          <Box className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            {/* Time range selector if timeRanges provided */}
            {timeRanges && (
              <ButtonGroup size="small" variant="outlined" className="mr-2">
                {Object.keys(timeRanges).map((range) => (
                  <Button
                    key={range}
                    onClick={() => handleTimeRangeChange(range)}
                    variant={timeRange === range ? "contained" : "outlined"}
                    color="primary"
                  >
                    {timeRanges[range].label}
                  </Button>
                ))}
              </ButtonGroup>
            )}

            {/* Chart type selector if allowed */}
            {allowTypeToggle && (
              <ButtonGroup size="small" variant="outlined">
                <Button
                  onClick={() => handleChartTypeChange("line")}
                  variant={chartType === "line" ? "contained" : "outlined"}
                  color="primary"
                >
                  Line
                </Button>
                <Button
                  onClick={() => handleChartTypeChange("bar")}
                  variant={chartType === "bar" ? "contained" : "outlined"}
                  color="primary"
                >
                  Bar
                </Button>
                {lines.length > 0 && bars.length > 0 && (
                  <Button
                    onClick={() => handleChartTypeChange("combo")}
                    variant={chartType === "combo" ? "contained" : "outlined"}
                    color="primary"
                  >
                    Combo
                  </Button>
                )}
              </ButtonGroup>
            )}
          </Box>
        </Box>

        {loading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={calculateHeight()}
          >
            <CircularProgress />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            {renderChart()}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

OverviewChart.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  lines: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ),
  bars: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ),
  xAxisKey: PropTypes.string,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(["line", "bar", "combo"]),
  allowTypeToggle: PropTypes.bool,
  tooltipFormatter: PropTypes.func,
  yAxisFormatter: PropTypes.func,
  timeRanges: PropTypes.object,
};

export default OverviewChart;
