import { useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";

const Chart4 = ({ totalHoursOfAttendance }) => {
  const maxHours = 100;
  const fillColor =
    totalHoursOfAttendance < 50
      ? "#FF0000"
      : totalHoursOfAttendance < 75
      ? "#FFA500"
      : totalHoursOfAttendance < 100
      ? "#4CAF50"
      : "#0000FF"; // Color based on hours

  const [hoveredData, setHoveredData] = useState({
    label: "عدد ساعات الحضور",
    percentage: totalHoursOfAttendance,
  });

  // Memoize chart options to prevent unnecessary re-renders
  const chartOptions = useMemo(
    () => ({
      chart: {
        width: 380,
        type: "donut",
        events: {
          dataPointMouseEnter: (event, chartContext, { seriesIndex }) => {
            // Update hover data on mouse enter
            setHoveredData({
              label: "عدد ساعات الحضور",
              percentage: totalHoursOfAttendance,
            });
          },
        },
      },
      labels: ["اجمالي ساعات الحضور"],
      colors: [fillColor, "#E0E0E0"], // Color for attendance and gray for the empty space
      dataLabels: {
        enabled: false, // Disable data labels
      },
      tooltip: {
        custom: function () {
          return `<div style="padding: 10px; font-size: 14px; font-weight: bold; text-align: center;"> 
            H عدد ساعات الحضور: ${totalHoursOfAttendance} 
          </div>`;
        },
      },
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "22px", 
                fontWeight: "bold",
                color: fillColor,
                formatter: () => hoveredData.label,
              },
              value: {
                show: true,
                fontSize: "22px",
                fontWeight: "bold",
                color: "green",
                formatter: () => `${totalHoursOfAttendance} H`, // Display total hours
              },
              total: {
                show: true,
                label: "اجمالي ساعات الحضور",
                fontWeight: "bold",
                color: '#666',
                formatter: () => `${totalHoursOfAttendance} H`, // Display hours with unit
              },
            },
          },
        },
      },
      stroke: {
        show: true,
        width: 5, // Width of the surrounding circle
        colors: ["#ccc"], // Border color (black in this case)
      },
    }),
    [totalHoursOfAttendance, fillColor, hoveredData.label]
  ); // Dependencies for memoization

  // Memoize series to prevent unnecessary re-renders
  const chartSeries = useMemo(
    () => [totalHoursOfAttendance, maxHours - totalHoursOfAttendance],
    [totalHoursOfAttendance, maxHours]
  );

  return (
    <div className="flex flex-col justify-center items-center my-4">
      <div id="chart" className="w-fit h-[250px]">
        <ReactApexChart
          options={chartOptions} // Use memoized options
          series={chartSeries} // Use memoized series
          type="donut"
          //   width={350}
        />
      </div>
      <div
        className="text-center"
        style={{
          marginTop: "10px",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        اجمالي ساعات الحضور
      </div>
    </div>
  );
};

export default Chart4;
