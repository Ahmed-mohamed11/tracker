import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaArrowCircleDown } from "react-icons/fa";
import Table from "../../components/Table";
import * as XLSX from "xlsx";
import FormSelect from "../../components/form/FormSelect";

const DailyMovementsTable = ({ openCreate }) => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // New state for filters
  const [branches, setBranches] = useState([]);
  const [entities, setEntities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate()); // Set to one week before today
    today.setDate(today.getDate() + 1);
    setStartDate(lastWeek.toISOString().split("T")[0]); // YYYY-MM-DD format
    setEndDate(today.toISOString().split("T")[0]); // YYYY-MM-DD format
  }, []);

  // Function to save data to Excel
  const handleSaveToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activities");
    XLSX.writeFile(workbook, "activities_data.xlsx");
  };

  // Fetch branches, entities, and employees
  const fetchFiltersData = async () => {
    const token = Cookies.get("token");
    try {
      const [branchRes, entityRes, employeeRes] = await Promise.all([
        axios.get("https://bio.skyrsys.com/api/branch/branches/", {
          headers: { Authorization: `Token ${token}` },
        }),
        axios.get("https://bio.skyrsys.com/api/entity/", {
          headers: { Authorization: `Token ${token}` },
        }),
        axios.get("https://bio.skyrsys.com/api/employee/", {
          headers: { Authorization: `Token ${token}` },
        }),
      ]);

      setBranches(
        branchRes.data.map((branch) => ({
          value: branch.id,
          label: branch.branch_name,
        }))
      );
      setEntities(
        entityRes.data.map((entity) => ({
          value: entity.id,
          label: entity.ar_name,
        }))
      );
      setEmployees(
        employeeRes.data.map((employee) => ({
          value: employee.id,
          label: `${employee.first_name} ${employee.last_name}`,
        }))
      );
    } catch (error) {
      console.error(
        "Error fetching filter data:",
        error.response?.data || error.message
      );
    }
  };

  const handleFilter = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    console.log("Selected Branch:", selectedBranch);
    console.log("Selected Entity:", selectedEntity);
    console.log("Selected Employee:", selectedEmployee);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Table Data:", tableData);

    try {
      // إعداد الـ params بناءً على القيم الحالية للفلاتر
      const params = {
        branch: selectedBranch || undefined, // إرسال ID الفرع إذا كان موجودًا
        entity: selectedEntity || undefined, // إرسال ID الجهة إذا كانت موجودة
        employee: selectedEmployee || undefined, // إرسال ID الموظف إذا كان موجودًا
        activity_type: "attendance", // تثبيت نوع النشاط
        start_date: startDate || undefined, // إرسال تاريخ البداية إذا كان موجودًا
        end_date: endDate || undefined, // إرسال تاريخ النهاية إذا كان موجودًا
      };

      console.log(params);

      // طلب البيانات من API
      const response = await axios.get(
        "https://bio.skyrsys.com/api/reports/activities/",
        {
          headers: { Authorization: `Token ${token}` },
          params, // تمرير الفلاتر كـ params
        }
      );

      // تجهيز البيانات للعرض في الجدول
      const formattedData = response.data.map((request) => ({
        employee: request.employee
          ? `${request.employee.first_name} ${request.employee.last_name}`
          : "مجهول",
        branch: request.employee.branch || "مجهول",
        email: request.employee.email || "مجهول",
        entity: request.employee.entity?.ar_name || "مجهول",
        timestamp: new Date(request.timestamp).toISOString().split("T")[0],
      }));

      // تحديث بيانات الجدول
      setFilteredData(formattedData);
    } catch (error) {
      console.error(
        "Error fetching filtered data:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false); // البيانات جاهزة للعرض
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      handleFilter();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchFiltersData();
  }, []);

  return (
    <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
      <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500  border-b">
        <h2 className="text-2xl font-bold">حركات التحضير</h2>
      </div>

      <div className='items-end grid grid-cols-1 mb-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        <FormSelect label="الفرع" options={branches} onChange={(e) => setSelectedBranch(e.target.value)} />
        <FormSelect label="الجهه" options={entities} onChange={(e) => setSelectedEntity(e.target.value)} />
        <FormSelect label="الموظف" options={employees} onChange={(e) => setSelectedEmployee(e.target.value)} />
        <FormSelect
          label="النوع"
          options={[
            { value: 'Attendance', label: 'حضور' },
            { value: 'Departure', label: 'انصراف' },
          ]}
          onChange={(e) => setSelectedActivity(e.target.value)}
        />

        <button onClick={handleFilter} className="bg-themeColor-400 text-white px-4 py-2 rounded-md">عرض البيانات</button>
      </div>

      <div className="hidden">
        <label htmlFor="end_date">تاريخ الانتهاء</label>
        <input
          className="border border-gray-300 rounded-md p-2"
          type="date"
          id="end_date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <button
        onClick={handleFilter}
        className="bg-themeColor-400 text-white px-4 py-2 rounded-md"
      >
        عرض البيانات
      </button>
    </div>

      {
    loading ? (
      <div className="text-center py-10">جاري تحميل البيانات...</div>
    ) : filteredData.length > 0 ? (
      <Table
        data={filteredData}
        headers={[
          { key: "employee", label: "اسم الموظف" },
          { key: "email", label: "البريد الإلكتروني" },
          { key: "branch", label: "اسم الفرع" },
          { key: "entity", label: "اسم الجهة" },
          { key: "timestamp", label: "وقت الحضور" },
        ]}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / itemsPerPage)}
        setCurrentPage={setCurrentPage}
      />
    ) : (
      <div className="text-center py-10">لا توجد بيانات لعرضها.</div>
    )
  }
    </div >
  );
};

export default DailyMovementsTable;
