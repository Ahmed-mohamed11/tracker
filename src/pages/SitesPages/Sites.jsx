"use client";
import {
  useCallback,
  useState,
  useEffect,
  lazy,
  Suspense,
  useMemo,
} from "react";
import gsap from "gsap";
import SitesTable from "./SitesTable";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";

// const PreviewProjects = lazy(() => import("./PreviewProjects"));

// const PreviewSites = lazy(() => import("./PreviewSites"));
const AddSites = lazy(() => import("./AddSites"));
const EditSite = lazy(() => import("./EditSite"));

const Sites = ({ role }) => {
  //   const [openPreview, setOpenPreview] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [data, setData] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);

  const toggleOpenCreateModal = useCallback(
    () => setOpenCreate((prev) => !prev),
    []
  );
  //   const toggleOpenPreviewModal = useCallback(
  //     () => setOpenPreview((prev) => !prev),
  //     []
  //   );
  const toggleOpenEditModal = useCallback((site) => {
    setSelectedSite(site);
    setOpenEdit((prev) => !prev);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".chart-container",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2 }
        );
      });

      return () => ctx.revert();
    }
  }, []);

  const chartSection = useMemo(
    () => (
      <div className="flex flex-col flex-wrap items-center justify-between gap-4 md:flex-row lg:flex-row xl:flex-row"></div>
    ),
    []
  );

  const fetchData = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found in cookies");
        return;
      }

      const response = await axios.get(
        "https://bio.skyrsys.com/api/company/location/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      const locations = response.data;
      setData(locations);
      console.log(locations);
    } catch (error) {
      console.error(
        "Error fetching locations:",
        error.response?.data || error.message
      );
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="flex items-center">
        <main className="-mt-5 flex w-full flex-col lg:flex-row">
          <section className="flex-1">
            <SitesTable
              //   openPreview={toggleOpenPreviewModal}
              openCreate={toggleOpenCreateModal}
              openEdit={toggleOpenEditModal}
              data={data}
              fetchData={fetchData}
            />
            <Suspense fallback={<div>Loading...</div>}>
              <AddSites
                closeModal={toggleOpenCreateModal}
                open={openCreate}
                role={role}
                fetchData={fetchData}
              />
              {/* {openPreview && (
                <PreviewSites closeModal={toggleOpenPreviewModal} />
              )} */}
              {openEdit && (
                <EditSite
                  closeModal={toggleOpenEditModal}
                  site={selectedSite}
                  fetchData={fetchData}
                  open={openEdit}
                />
              )}
            </Suspense>
          </section>
          <ToastContainer />
        </main>
      </div>
    </>
  );
};

export default Sites;
