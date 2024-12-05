import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Chart1 from "../../components/Chart-1";
import Chart2 from "../../components/Chart-2";
import Chart3 from "../../components/Chart-3";
import Chart4 from "../../components/Chart-4";
import FormSelect from "../../components/form/FormSelect";

export default function Dashboard() {
  const [branches, setBranches] = useState([]);
  const [entities, setEntities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lastLogin, setLastLogin] = useState("");
  const [currentPlan, setCurrentPlan] = useState("");
  const [executeDate, setExecuteDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [totalAttendancePercentage, setTotalAttendancePercentage] = useState(0);
  const [totalHoursOfAttendance, setTotalHoursOfAttendance] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [chartData2, setChartData2] = useState(null);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      const headers = { Authorization: `Token ${token}` };

      const [branchesResponse, entitiesResponse, employeesResponse] =
        await Promise.all([
          axios.get("https://bio.skyrsys.com/api/branch/branches/", {
            headers,
          }),
          axios.get("https://bio.skyrsys.com/api/entity/", { headers }),
          axios.get("https://bio.skyrsys.com/api/employee/", { headers }),
        ]);

      setBranches(branchesResponse.data);
      setEntities(entitiesResponse.data);
      setEmployees(employeesResponse.data);

      // Set selected values to empty strings
      setSelectedBranch("");
      setSelectedEntity("");
      setSelectedEmployee("");

      // Set default values for dates
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      setStartDate(lastWeek.toISOString().split("T")[0]); // Start date is one week ago
      setEndDate(today.toISOString().split("T")[0]); // End date is today
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDataDisplay = async () => {
    const params = new URLSearchParams({
      employee: selectedEmployee,
      branch: selectedBranch,
      entity: selectedEntity,
      start_date: startDate,
      end_date: endDate,
    });

    try {
      const response = await axios.get(
        `https://bio.skyrsys.com/api/dashboard/?${params.toString()}`,
        {
          headers: { Authorization: `Token ${Cookies.get("token")}` },
        }
      );
      const {
        first_chart,
        second_chart,
        section_employees,
        account_informations,
      } = response.data;
      console.log("55", response.data);
      setChartData({
        first_chart: {
          attendance_absent_counts: first_chart.attendance_absent_counts,
          attendance_intime_counts: first_chart.attendance_intime_counts,
          attendance_late_counts: first_chart.attendance_late_counts,
        },
      });
      const filteredAttendance =
        second_chart.attendance_before_time_counts.filter((entry) => {
          const entryDate = new Date(entry.date);
          return (
            entryDate >= new Date(startDate) && entryDate <= new Date(endDate)
          );
        });

      const filteredDeparture =
        second_chart.departure_before_time_counts.filter((entry) => {
          const entryDate = new Date(entry.date);
          return (
            entryDate >= new Date(startDate) && entryDate <= new Date(endDate)
          );
        });

      const filteredOvertime = second_chart.overtime_counts.filter((entry) => {
        const entryDate = new Date(entry.date);
        return (
          entryDate >= new Date(startDate) && entryDate <= new Date(endDate)
        );
      });

      setChartData2({
        second_chart: {
          attendance_before_time_counts: filteredAttendance,
          departure_before_time_counts: filteredDeparture,
          overtime_counts: filteredOvertime,
        },
      });

      setTotalAttendancePercentage(
        section_employees.total_attendance_percentage
      );
      setTotalHoursOfAttendance(section_employees.total_hours_of_attendance);
      setId(account_informations.account_id);
      setExecuteDate(account_informations.start_date);
      setFinishDate(account_informations.end_date);
      setCurrentPlan(account_informations.current_plan);
      setLastLogin(account_informations.last_login.split("T")[0]);
    } catch (error) {
      console.error("Error fetching data from API:", error);
      setError("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    handleDataDisplay();
  }, [selectedBranch, selectedEntity, selectedEmployee, startDate, endDate]);

  useEffect(() => {
    if (
      selectedBranch &&
      selectedEntity &&
      selectedEmployee &&
      startDate &&
      endDate
    ) {
      handleDataDisplay();
    }
  }, [handleDataDisplay]);

  const isFormValid = useMemo(() => {
    return (
      selectedBranch &&
      selectedEntity &&
      selectedEmployee &&
      startDate &&
      endDate
    );
  }, [selectedBranch, selectedEntity, selectedEmployee, startDate, endDate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mx-10">
      <h2 className="text-2xl font-bold text-gray-800 py-5">لوحه الاداء</h2>
      <div className="items-end grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <FormSelect
          label="الفرع"
          options={branches.map((branch) => ({
            label: branch.branch_name,
            value: branch.id,
          }))}
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        />
        <FormSelect
          label="الجهه"
          options={entities.map((entity) => ({
            label: entity.ar_name,
            value: entity.id,
          }))}
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
        />
        <FormSelect
          label="الموظف"
          options={employees.map((employee) => ({
            label: employee.first_name,
            value: employee.id,
          }))}
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        />
        <div className="flex flex-col">
          <label
            htmlFor="startDate"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            تاريخ البداية
          </label>
          <input
            type="date"
            id="startDate"
            className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="endDate"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            تاريخ الانتهاء
          </label>
          <input
            type="date"
            id="endDate"
            className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          onClick={handleDataDisplay}
          className={`bg-themeColor-400 border border-gray-300 w-full text-white px-4 py-2 rounded-md`}
        >
          عرض البيانات
        </button>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="my-5 p-5 border-2 border-gray-300 rounded-md">
          <Chart1
            chartData={chartData}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div className="my-5 p-5 border-2 border-gray-300 rounded-md">
          <Chart2
            chartData={chartData2}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 ">
        <div className="border-2 border-gray-300 rounded-md w-full md:flex justify-center items-center">
          <Chart3
            totalHoursOfAttendance={totalHoursOfAttendance} 
            totalAttendancePercentage={totalAttendancePercentage}
          />
          <Chart4 totalHoursOfAttendance={totalHoursOfAttendance} />
        </div>

        <div
          className="py-4 px-4 border-2 border-gray-300 rounded-md sm:px-6 lg:px-8"
          dir="rtl"
        >
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">
                معلومات الحساب
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccountInfo label="الخطة الحالية" value={currentPlan} />
                <AccountInfo label="تاريخ بدء التشغيل" value={executeDate} />
                <AccountInfo label="تاريخ انتهاء الخطة" value={finishDate} />
                <AccountInfo label="تاريخ اخر تسجيل دخول" value={lastLogin} />
                <AccountInfo label="المعرف" value={id} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Account Information */}
    </div>
  );
}

const AccountInfo = ({ label, value }) => (
  <div className="p-4 border rounded-lg">
    <p className="text-gray-600">{label}</p>
    <p className="text-blue-900 font-semibold">{value}</p>
  </div>
);
