import { FaPlus } from "react-icons/fa";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Table from "../../components/Table";
import * as XLSX from "xlsx";
import FormSelect from "../../components/form/FormSelect";

const EntitiesTable = ({ openCreate, refreshData }) => {
  const [tableData, setTableData] = useState([]);
  const [branchesData, setBranchesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBranchesData = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found in cookies");
        return;
      }

      const response = await axios.get(
        "https://bio.skyrsys.com/api/branch/branches/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      const branches = response.data;

      const formattedData = branches.map((branch) => ({
        value: branch.id,
        label: branch.branch_name || "",
      }));

      //

      setBranchesData(formattedData);
    } catch (error) {
      console.error(
        "Error fetching branches:",
        error.response?.data || error.message
      );
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found in cookies");
        return;
      }

      const response = await axios.get("https://bio.skyrsys.com/api/entity/", {
        headers: { Authorization: `Token ${token}` },
      });

      const entities = response.data;

      setTableHeaders([
        { key: "ar_name", label: "الاسم باللغه العربيه" },
        { key: "en_name", label: "الاسم باللغه الانجليزيه" },
        { key: "branch", label: "الفرع" },
      ]);

      // Format the data to include the new fields
      const formattedData = entities.map((entity) => ({
        ar_name: entity.ar_name || "مجهول",
        en_name: entity.en_name || "Unknown",
        branch:
          branchesData.find(
            (branchI) => String(branchI.value) === String(entity.branch)
          )?.label || "N/A",
        created: new Date(entity.created).toLocaleDateString("en-US"),
      }));

      console.log(formattedData);

      setTableData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error(
        "Error fetching entity:",
        error.response?.data || error.message
      );
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchBranchesData();
  }, [fetchData, fetchBranchesData, refreshData]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = tableData.filter(
      (item) =>
        item.ar_name.toLowerCase().includes(query) ||
        item.en_name.toLowerCase().includes(query) ||
        item.branch.toString().toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleSaveToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entities");

    const fileName = "entities_data.xlsx";
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
      <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500 border-b">
        <h2 className="text-2xl font-bold">الجهات</h2>
        <button
          className="flex border-2 items-center justify-center p-2 rounded-full bg-themeColor-600 text-white hover:bg-themeColor-700 transition duration-200"
          onClick={openCreate}
        >
          <FaPlus className="h-6 w-6" />
        </button>
      </div>

      <Table
        data={filteredData}
        headers={tableHeaders}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default EntitiesTable;
