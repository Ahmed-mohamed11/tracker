import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ReactApexChart from "react-apexcharts";

// Bar Chart Component
const BarChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-center text-gray-500">لا توجد بيانات للمخطط.</p>;
  }

  const chartOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: Object.keys(data),
    },
    colors: ["#008FFB"],
    title: {
      text: "Request Types",
      align: "center",
      style: {
        fontSize: "18px",
      },
    },
  };

  const chartSeries = [
    {
      name: "Requests",
      data: Object.values(data),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      />
    </div>
  );
};

// Pie Chart Component
const PieChart = ({ data, title }) => {
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-center text-gray-500">لا توجد بيانات للمخطط.</p>;
  }
  const chartOptions = {
    chart: {
      type: "pie",
    },
    labels: Object.keys(data), // التصنيفات مثل pending, approved, refused
    // الألوان
    legend: {
      show: true,
      position: "bottom", // وضع الـ Legend تحت الشارت
      horizontalAlign: "center",
      labels: {
        colors: ["#333"], // لون النصوص
        useSeriesColors: false, // استخدام ألوان الشارت للتصنيفات
      },
    },
  };

  const chartSeries = Object.values(data);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-[400px] h-[400px] mx-auto">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="pie"
        height={300}
      />
    </div>
  );
};

const EmployeeRequestsReportsTable = () => {
  const [barChartData, setBarChartData] = useState({});
  const [requestTypePieChartData, setRequestTypePieChartData] = useState({});
  const [statusTypePieChartData, setStatusTypePieChartData] = useState({});
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          "https://bio.skyrsys.com/api/employee-requests/reports/",
          { headers: { Authorization: `Token ${token}` } }
        );

        const {
          bar_chart,
          request_type_pie_chart,
          status_type_pie_chart,
          requests,
        } = response.data;

        setBarChartData(bar_chart);
        setRequestTypePieChartData(request_type_pie_chart);
        setStatusTypePieChartData(status_type_pie_chart);
        setRequests(requests);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Error loading chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto px-5">
      {/* Header */}
      <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500  border-b">
        <h2 className="text-2xl font-bold">تقرير الأذونات</h2>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChart data={barChartData} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <PieChart
            data={requestTypePieChartData}
            title="Request Type Status"
          />
          <PieChart data={statusTypePieChartData} title="Status Type" />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto my-10">
        <table className="min-w-full border-collapse bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                اسم الموظف
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                نوع الإذن
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                الحالة
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                تاريخ البداية
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                تاريخ النهاية
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                الملاحظات
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                المرفقات
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((request, index) => (
                <tr
                  key={request.id}
                  className={`hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {request.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.first_name} {request.last_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.request_type}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.start_date}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.end_date}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.note || "لا يوجد"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.attachments ? (
                      <a
                        href={request.attachments}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        عرض المرفق
                      </a>
                    ) : (
                      "لا يوجد"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  لا توجد طلبات حالياً.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeRequestsReportsTable;
