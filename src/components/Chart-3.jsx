import ReactApexChart from "react-apexcharts";
import React, { useState } from "react";

const Chart3 = ({ totalAttendancePercentage }) => {
  const fillPercentage = totalAttendancePercentage;

  const getColorByPercentage = (percentage) => {
    if (percentage < 50) return "#FF6B6B"; // Light red for < 50%
    if (percentage < 75) return "#FFC300"; // Yellow for 50% to 75%
    if (percentage < 100) return "#4CAF50"; // Green for 75% to 99%
    return "#3B82F6"; // Blue for 100%
  };

  const attendanceColor = getColorByPercentage(fillPercentage);

  // State to track hovered data
  const [hoveredData, setHoveredData] = useState({
    label: "اجمالي نسبه الحضور",
    percentage: fillPercentage,
  });

  const chartOptions = {
    chart: {
      width: 400,
      type: "donut",
      events: {
        dataPointMouseEnter: (
          event,
          chartContext,
          { seriesIndex, dataPointIndex }
        ) => {
          // Update hovered data dynamically
          setHoveredData({
            label: seriesIndex === 0 ? "اجمالي نسبه الحضور" : "باقي النسبة",
            percentage:
              seriesIndex === 0 ? fillPercentage : 100 - fillPercentage,
          });
        },
        dataPointMouseLeave: () => {
          // Reset to default when not hovering
          setHoveredData({
            label: "اجمالي نسبه الحضور",
            percentage: fillPercentage,
          });
        },
      },
    },
    labels: ["اجمالي نسبه الحضور", "باقي النسبة"], // Labels for parts
    colors: [attendanceColor, "#E0E0E0"], // Attendance color and gray for remaining space
    dataLabels: {
      enabled: false, // Disable default data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      custom: ({ seriesIndex }) => {
        return `<div style="padding: 10px; font-size: 14px; font-weight: bold; text-align: center;">
                  % ${hoveredData.label}: ${hoveredData.percentage}
                </div>`;
      },
    },
    legend: {
      show: false, // Disable legend for simplicity
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%", // Adjust donut size
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: "bold",
              color: attendanceColor,
              formatter: () => hoveredData.label, // Dynamic label
            },
            value: {
              show: true,
              fontSize: "22px", // Larger font for percentage
              fontWeight: "bold",
              color: attendanceColor,
              formatter: () => `${hoveredData.percentage.toFixed(1)} %`, // Show percentage dynamically
            },
            total: {
              show: true,
              fontSize: "18px",
              fontWeight: "bold",
              label: "اجمالي النسبة",
              color: "#666",
              formatter: () => `${fillPercentage.toFixed(1)} %`, // Total percentage display
            },
          },
        },
      },
    },
    stroke: {
      show: true,
      width: 5, // Border width around the donut
      colors: ["#ccc"], // Border color
    },
  };

  return (
    <div className="flex flex-col justify-center items-center my-4">
      <div id="chart" className="w-fit h-[250px]">
        <ReactApexChart
          options={chartOptions}
          series={[fillPercentage, 100 - fillPercentage]} // Attendance and remaining space
          type="donut"
        />
      </div>
      <div
        className="text-center"
        style={{
          marginTop: "10px",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        اجمالي نسبه الحضور
      </div>
    </div>
  );
};

export default Chart3;
