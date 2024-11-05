import ReactApexChart from "react-apexcharts";

// وظيفة لإنشاء جميع التواريخ بين تاريخين
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(new Date(currentDate).toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const Chart1 = ({ chartData, startDate, endDate }) => {
  const attendanceData = chartData?.first_chart.attendance_absent_counts || [];
  const intimeData = chartData?.first_chart.attendance_intime_counts || [];
  const lateData = chartData?.first_chart.attendance_late_counts || [];

  // إنشاء نطاق التواريخ بين startDate و endDate
  const categories = generateDateRange(startDate, endDate);

  const series = [
    {
      name: "الحضور",
      data: categories.map((date) => {
        const entry = intimeData?.find((d) => d.date === date);
        return entry ? entry.count : 0; // إذا لم تكن هناك بيانات، تكون القيمة 0
      }),
    },
    {
      name: "الغياب",
      data: categories.map((date) => {
        const entry = attendanceData?.find((d) => d.date === date);
        return entry ? entry.count : 0; // إذا لم تكن هناك بيانات، تكون القيمة 0
      }),
    },
    {
      name: "التأخير",
      data: categories.map((date) => {
        const entry = lateData?.find((d) => d.date === date);
        return entry ? entry.count : 0; // إذا لم تكن هناك بيانات، تكون القيمة 0
      }),
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: "area",
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    xaxis: {
      type: "datetime",
      categories: categories,
      labels: { format: "yyyy-MM-dd" },
    },
    tooltip: {
      x: { format: "yyyy-MM-dd" },
    },
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default Chart1;
