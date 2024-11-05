import ReactApexChart from "react-apexcharts";

const Chart2 = ({ chartData, startDate, endDate }) => {
  // استخراج البيانات من chartData
  const attendanceData =
    chartData?.second_chart.attendance_before_time_counts || [];
  const departureData =
    chartData?.second_chart.departure_before_time_counts || [];
  const overtimeData = chartData?.second_chart.overtime_counts || [];

  // إعداد البيانات للرسم البياني
  const series = [
    {
      name: "الحضور المبكر",
      data: attendanceData.map((entry) => [
        new Date(entry.date).getTime(),
        entry.count,
      ]),
    },
    {
      name: "الإنصراف المبكر",
      data: departureData.map((entry) => [
        new Date(entry.date).getTime(),
        entry.count,
      ]),
    },
    {
      name: "العمل الإضافي",
      data: overtimeData.map((entry) => [
        new Date(entry.date).getTime(),
        entry.count,
      ]),
    },
  ];

  const allCounts = [
    ...attendanceData.map((entry) => entry.count),
    ...departureData.map((entry) => entry.count),
    ...overtimeData.map((entry) => entry.count),
  ];
  const maxYValue = Math.max(...allCounts);

  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["#008FFB", "#00E396", "#CED4DC"],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "solid", // استخدام تعبئة صلبة
      opacity: 0.6, // ضبط الشفافية لجعل التكديس أكثر وضوحًا
    },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: {
      type: "datetime",
      min: new Date(startDate).getTime(),
      max: new Date(endDate).getTime(),
      labels: { format: "yyyy-MM-dd" }
    },
    yaxis: {
      max: maxYValue, // تعيين القيمة القصوى لمحور y
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

export default Chart2;
