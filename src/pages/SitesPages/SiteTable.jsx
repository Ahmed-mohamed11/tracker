import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import AddSites from "./AddSites"; // Ensure the path is correct
import PreviewProjects from "./PreviewProjects";
import Table from "../../components/Table";
import { IoSearch } from "react-icons/io5";
import { FaArrowCircleDown, FaPlus } from "react-icons/fa";
import { useI18nContext } from "../../context/i18n-context";

const ProjectTable = ({ openPreview, openCreate }) => {
  const { t } = useI18nContext(); // Get the translation function
  const [modalType, setModalType] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const token = Cookies.get("token"); // Retrieve token from cookies
      if (!token) {
        console.error("No token found in cookies");
        return;
      }

      // Fetch locations from the new API endpoint
      const response = await axios.get(
        "https://bio.skyrsys.com/api/company/location/",
        {
          headers: {
            Authorization: `Token ${token}`, // Include token in the request header
          },
        }
      );

      const locations = response.data;

      if (locations.length > 0) {
        // Define headers according to the required fields
        const headers = [
          { key: "branch", label: t("sites.branch") },
          { key: "ar_name", label: t("sites.arName") },
          { key: "en_name", label: t("sites.enName") },
        ];
        setTableHeaders(headers);

        console.log(locations);
        setTableData(locations || []);
      } else {
        setTableHeaders([]);
        setTableData([]);
      }
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
    }
  }, []);

  const handleOpenCreate = () => {
    console.log("Open Create button clicked");
    openCreate();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addNewLocationToTable = (newLocation) => {
    setTableData((prevData) => [...prevData, newLocation]);
  };

  return (
    <div className="col-span-2 min-h-screen mt-10 w-full mx-auto">
      <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500 border-b ">
        <h2 className="text-2xl font-bold">إدارة جميع المواقع</h2>
        <button
          className="flex items-center justify-center p-2 rounded-full bg-themeColor-600 text-white hover:bg-themeColor-700 transition duration-200"
          onClick={handleOpenCreate}
        >
          <FaPlus className="h-6 w-6 " />
        </button>
      </div>
      <div className="flex justify-between items-center mt-6 gap-14">
        <div className="flex w-full gap-5">
          <div className="relative flex items-center justify-center">
            <input
              type="text"
              placeholder={t("registrationForm.searchPlaceholder")}
              className="bg-gray-200 text-gray-900 px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-themeColor-500"
            />
            <div className="h-full absolute px-2 right-0 top-0 rounded-r-md border-gray-600 text-gray-400 flex items-center justify-center">
              <IoSearch size={20} />
            </div>
          </div>

          <select className="bg-gray-200 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200">
            <option value="">{t("registrationForm.requestStatus")}</option>
            <option value="pending">{t("registrationForm.pending")}</option>
            <option value="approved">{t("registrationForm.approved")}</option>
            <option value="rejected">{t("registrationForm.rejected")}</option>
          </select>

          <button className="bg-themeColor-500 text-white text-center hover:bg-themeColor-600 px-4 py-2 rounded-md transition duration-200 flex items-center">
            {t("registrationForm.export")}
            <FaArrowCircleDown size={20} className="mr-2" />
          </button>
        </div>
      </div>

      <Table
        data={tableData}
        headers={tableHeaders}
        openCreate={() => setModalType("project")}
        openPreview={openPreview}
        addItemLabel={t("project")}
        onDelete={() => console.log("Delete function not implemented")}
      />
      {modalType === "preview" && (
        <PreviewProjects
          closeModal={() => setModalType(null)}
          projectIdId={selectedProjectId}
        />
      )}
      {modalType === "project" && (
        <AddSites
          closeModal={() => setModalType(null)}
          modal={modalType === "project"}
          onClientAdded={addNewLocationToTable}
        />
      )}
    </div>
  );
};

export default ProjectTable;
