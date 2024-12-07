import { Check, Eye, Play, Trash, X } from "lucide-react";
import { Fragment, useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { IoSearch } from "react-icons/io5";
import { FaArrowCircleDown, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Table from "../../components/Table";
import ReviewRequest from "./ReviewRequest";
import img from "../../../public/non.jpg";

const MySwal = withReactContent(Swal);

const TableActions = ({ row, approveRequest, refuseRequest }) => {
  if (row.status !== "قيد الانتظار") {
    return null; // لا تعرض أي شيء إذا لم تكن الحالة "قيد الانتظار"
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => refuseRequest(row.id)}
        className="text-primary-500 bg-primary-200 p-1 rounded-full "
      >
        <X size={22} />
      </button>
      <button
        onClick={() => approveRequest(row.id)}
        className="text-themeColor-500 bg-themeColor-200 p-1 rounded-full"
      >
        <Check size={22} />
      </button>
    </div>
  );
};

const TableUser = ({ row, openReviewRequest }) => {
  return (
    <Fragment>
      <td className="py-4">
        <div
          className={`flex items-center px-2.5 py-0.5 rounded text-nowrap ${
            row.status === "موافقة"
              ? "bg-green-200 text-green-700"
              : row.status === "مرفوض"
              ? "bg-red-200 text-red-700"
              : "bg-yellow-200 text-yellow-700"
          }`}
        >
          <div
            className={`h-2.5 w-2.5 rounded-full me-2 ${
              row.status === "موافقة"
                ? "bg-green-500"
                : row.status === "مرفوض"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          ></div>
          {row.status || "غير محدد"}
        </div>
      </td>
    </Fragment>
  );
};

const EmployeeTable = ({ openCreate, refreshData }) => {
  const [showReviewRequest, setShowReviewRequest] = useState(false);
  const [requestData, setRequestData] = useState(null); // بيانات الطلب
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchData = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found in cookies");
        return;
      }

      const response = await axios.get(
        "https://bio.skyrsys.com/api/employee-requests/list/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      const registrationRequests = response.data;

      setTableHeaders([
        { key: "first_name", label: "الاسم الأول" },
        { key: "last_name", label: "الاسم الأخير" },
        { key: "email", label: "البريد الإلكتروني" },
        { key: "request_type", label: "نوع الطلب" },
        { key: "start_date", label: "تاريخ البدء" },
        { key: "end_date", label: "تاريخ الانتهاء" },
        // { key: "status", label: "الحالة" },
        { key: "company", label: "الشركة" },
        { key: "is_approved", label: "موافقة" },
      ]);

      // معالجة البيانات لتشمل الحقول الجديدة
      const formattedData = registrationRequests.map((request) => {
        const translatedStatus =
          request.status === "pending"
            ? "قيد الانتظار"
            : request.status === "approved"
            ? "موافقة"
            : "مرفوض";

        return {
          first_name: request.first_name || "مجهول",
          last_name: request.last_name || "مجهول",
          email: request.email || "مجهول",
          request_type: request.request_type || "غير محدد",
          start_date: request.start_date || "غير متوفر",
          end_date: request.end_date || "غير متوفر",
          status: translatedStatus, // عرض الحالة باللغة العربية
          company: request.company || "غير متوفر",
          is_approved: request.is_approved ? "نعم" : "لا",
          id: request.id,
        };
      });

      setTableData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error(
        "Error fetching registration requests:",
        error.response?.data || error.message
      );
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshData]);

  const handleFilterByStatus = (event) => {
    const selectedStatus = event.target.value;

    if (!selectedStatus) {
      setFilteredData(tableData);
    } else {
      const translatedStatus =
        selectedStatus === "pending"
          ? "قيد الانتظار"
          : selectedStatus === "approved"
          ? "موافقة"
          : "مرفوض";

      const filtered = tableData.filter(
        (item) => item.status === translatedStatus
      );
      setFilteredData(filtered);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = tableData.filter((item) => {
      return (
        (item.first_name && item.first_name.toLowerCase().includes(query)) ||
        (item.last_name && item.last_name.toLowerCase().includes(query)) ||
        (item.phone_number && item.phone_number.toString().includes(query)) ||
        (item.request_type &&
          item.request_type.toLowerCase().includes(query)) ||
        (item.status && item.status.toLowerCase().includes(query))
      );
    });

    setFilteredData(filtered);
  };

  const openReviewRequest = async (row) => {
    try {
      setRequestData(row);
      setShowReviewRequest(true);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  const approveRequest = async (id) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found in cookies");
        return;
      }

      const response = await axios.patch(
        `https://bio.skyrsys.com/api/employee-requests/approval/${id}/`,
        { is_approved: true },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      MySwal.fire({
        icon: "success",
        title: "تمت الموافقة على الطلب بنجاح",
        text: response.data.message || "تمت الموافقة على الطلب.",
      });

      fetchData(); // إعادة تحميل البيانات بعد الموافقة
    } catch (error) {
      console.error(
        "Error approving the request:",
        error.response?.data || error.message
      );
      MySwal.fire({
        icon: "error",
        title: "خطأ",
        text: error.response?.data?.detail || "فشل في الموافقة على الطلب.",
      });
    }
  };

  const refuseRequest = async (id) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found in cookies");
        return;
      }

      const response = await axios.patch(
        `https://bio.skyrsys.com/api/employee-requests/approval/${id}/`,
        { is_approved: false },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      MySwal.fire({
        icon: "success",
        title: "تم رفض الطلب بنجاح",
        text: response.data.message || "تم رفض الطلب.",
      });

      fetchData(); // إعادة تحميل البيانات بعد الرفض
    } catch (error) {
      console.error(
        "Error refusing the request:",
        error.response?.data || error.message
      );
      MySwal.fire({
        icon: "error",
        title: "خطأ",
        text: error.response?.data?.detail || "فشل في رفض الطلب.",
      });
    }
  };

  const exportTableToExcel = () => {
    const table = document.getElementById("table");
    const rows = table.rows;
    const csv = [];
    for (let i = 0; i < rows.length; i++) {
      const row = [];
      for (let j = 0; j < rows[i].cells.length; j++) {
        row.push(rows[i].cells[j].innerHTML);
      }
      csv.push(row.join(","));
    }
    const csvString = csv.join("\n");
    const a = document.createElement("a");
    a.href = "data:attachment/csv," + encodeURIComponent(csvString);
    a.target = "_blank";
    a.download = "employees.csv";
    document.body.appendChild(a);
    a.click();
  };

  return (
    <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
      <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500  border-b">
        <h2 className="text-2xl font-bold">طلبات الموظفين</h2>
        <button
          className="flex border-2 items-center justify-center p-2 rounded-full bg-themeColor-600 text-white hover:bg-themeColor-700 transition duration-200"
          onClick={() => openCreate()}
        >
          <FaPlus className="h-6 w-6" />
        </button>
      </div>

      <div className="flex justify-between items-center mb-6 gap-14">
        <div className="grid grid-cols-3 gap-4">
          <div className="relative flex items-center justify-center">
            <input
              type="text"
              placeholder="بحث"
              value={searchQuery}
              onChange={handleSearch}
              className="bg-gray-200 text-gray-900 px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-themeColor-500"
            />
            <div className="h-full absolute px-2 right-0 top-0 rounded-r-md border-gray-600 text-gray-400 flex items-center justify-center">
              <IoSearch size={20} />
            </div>
          </div>
          <select
            onChange={handleFilterByStatus}
            className="bg-gray-200 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200"
          >
            <option value="">كل الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="approved">موافقة</option>
            <option value="rejected">مرفوض</option>
          </select>
          <button
            onClick={() => exportTableToExcel()}
            className="w-1/2  bg-themeColor-500 text-white text-center hover:bg-themeColor-700 px-4 py-2 rounded-md transition duration-200 flex justify-center items-center"
          >
            تصدير
            <FaArrowCircleDown size={20} className="mr-2" />
          </button>
        </div>
      </div>

      {/* Table */}
      <Table
        data={filteredData}
        headers={tableHeaders}
        userImage={(row) => (
          <TableUser row={row} openReviewRequest={openReviewRequest} />
        )}
        actions={(row) => (
          <TableActions
            row={row}
            approveRequest={approveRequest}
            refuseRequest={refuseRequest}
            openReviewRequest={openReviewRequest}
          />
        )}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / itemsPerPage)}
        setCurrentPage={setCurrentPage}
      />

      {showReviewRequest && (
        <ReviewRequest
          className=""
          requestData={requestData} // تمرير بيانات الطلب إلى ReviewRequest
          onClose={() => setShowReviewRequest(false)}
        />
      )}
    </div>
  );
};

export default EmployeeTable;
