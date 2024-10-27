import { Check, Edit, Trash, X } from "lucide-react";
import { Fragment, useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { IoSearch } from "react-icons/io5";
import { FaArrowCircleDown, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Table from "../../components/Table";
import PreviewSites from "./PreviewSites";

const MySwal = withReactContent(Swal);

const TableActions = ({ row, handleDelete, ShowEditModal }) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <button onClick={() => handleDelete(row.id)} className="text-gray-500">
        <Trash size={22} />
      </button>
      <button onClick={() => ShowEditModal(row)} className="text-gray-500">
        <Edit size={22} />
      </button>
    </div>
  );
};

const SitesTable = ({ openCreate, data, fetchData, openEdit }) => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSite, setSelectedSite] = useState(null);

  const [branchesList, setBranchesList] = useState([]);
  const [dataList, setDataList] = useState(data);

  console.log(data);

  const fetchBranches = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("لم يتم العثور على الرمز في الكوكيز");
        return;
      }

      const response = await axios.get(
        "https://bio.skyrsys.com/api/working-hours/branchs-list/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      // console.log("Fetched branches data:", response.data);

      setBranchesList(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
    // console.log("hay",branchesList);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchDataFilter = useCallback(() => {
    if (!dataList.length) return; // Guard clause if dataList is empty

    setTableHeaders([
      { key: "branch", label: "الفرع" },
      { key: "ar_name", label: "الاسم بالعربية" },
      { key: "en_name", label: "الاسم بالإنجليزية" },
      { key: "latitude", label: "خط العرض" },
      { key: "longitude", label: "خط الطول" },
    ]);

    const formattedData = dataList.map((location) => ({
      id: location.id,
      branch:
        branchesList.find((branch) => branch.id === location.branch)
          ?.branch_name || "N/A",
      ar_name: location.ar_name,
      en_name: location.en_name,
      latitude: location.latitude,
      longitude: location.longitude,
      max_distance: location.max_distance,
    }));

    setTableData(formattedData);
    setFilteredData(formattedData);
  }, [dataList, branchesList]);

  const handleDelete = async (id) => {
    const confirmed = await MySwal.fire({
      title: "هل أنت متأكد؟",
      text: "لن يمكنك التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف!",
      cancelButtonText: "لا، إلغاء",
    });

    if (confirmed.isConfirmed) {
      try {
        const token = Cookies.get("token");
        await axios.delete(
          `https://bio.skyrsys.com/api/company/location/${id}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        // تحديث الحالة بعد الحذف
        setTableData((prevData) => prevData.filter((item) => item.id !== id));
        setFilteredData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );
        fetchData();
        MySwal.fire("محذوف!", "تم حذف العنصر بنجاح.", "success");
      } catch (error) {
        console.error(
          "Error deleting location:",
          error.response?.data || error.message
        );
        MySwal.fire("خطأ!", "حدث خطأ أثناء الحذف.", "error");
      }
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = tableData.filter(
      (item) =>
        item.ar_name.toLowerCase().includes(query) ||
        item.en_name.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const ShowEditModal = (site) => {
    setSelectedSite(site);
    openEdit(site);
  };

  useEffect(() => {
    setDataList(data);
  }, [data]);

  useEffect(() => {
    if (dataList.length) {
      fetchDataFilter();
    }
  }, [dataList, fetchDataFilter]);

  return (
    <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
      <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500 border-b">
        <h2 className="text-2xl font-bold">المواقع</h2>
        <button
          className="flex border-2 items-center justify-center p-2 rounded-full bg-themeColor-600 text-white hover:bg-themeColor-700 transition duration-200"
          onClick={() => openCreate()}
        >
          <FaPlus className="h-6 w-6" />
        </button>
      </div>

      <div className="flex justify-between items-center mb-6 gap-14">
        <div className="w-full relative flex items-center justify-center">
          <input
            type="text"
            placeholder="بحث"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-gray-200 text-gray-900 px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-themeColor-500"
          />
          <div className="h-full absolute px-2 right-0 top-0 rounded-r-md border-gray-600 text-gray-400 flex items-center justify-center">
            <IoSearch size={20} />
          </div>
        </div>
        <button
          onClick={() => console.log("Export to Excel")} // Add your export function here
          className="w-1/2 bg-themeColor-500 text-white text-center hover:bg-themeColor-700 px-4 py-2 rounded-md transition duration-200 flex justify-center items-center"
        >
          تصدير
          <FaArrowCircleDown size={20} className="mr-2" />
        </button>
      </div>

      {/* Table */}
      <Table
        data={filteredData}
        headers={tableHeaders}
        actions={(row) => (
          <TableActions
            row={row}
            handleDelete={handleDelete}
            ShowEditModal={ShowEditModal} 
          />
        )}
      />

      {/* عرض الموقع المختار في PreviewSites */}
      {selectedSite && (
        <PreviewSites
          site={selectedSite}
          closeModal={() => setSelectedSite(null)}
        />
      )}
    </div>
  );
};

export default SitesTable;
