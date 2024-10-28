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
import EmployeTable from "./EmployeTable";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PreviewProject = lazy(() => import("./PreviewProjects"));
const RegisterEmployee = lazy(() => import("./RegisterEmployee"));

const Projects = ({ role }) => {
  const [openPreview, setOpenPreview] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [tableData, setTableData] = useState([]);

  const toggleOpenCreateModal = useCallback(
    () => setOpenCreate((prev) => !prev),
    []
  );
  const toggleOpenPreviewModal = useCallback(
    () => setOpenPreview((prev) => !prev),
    []
  );

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

  const handleSubmit = async (e, formData) => {
    e.preventDefault();

    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("لم يتم العثور على الرمز في الكوكيز");
        return;
      }

      console.log(formData);

      const response = await axios.post(
        "https://bio.skyrsys.com/api/registration-requests/",
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("تمت إضافة طلب التسجيل بنجاح:", response.data);
      toast.success(`تم تسجيل الموظف بنجاح`, { pauseOnHover: false });
      toast.success(`تم ارسال بريد التفعيل علي البريد الالكتروني للموظف`, { pauseOnHover: false });
      await fetchData();
      toggleOpenCreateModal();
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData && typeof errorData === "object") {
        // Loop through each field's error and display them in separate toasts
        Object.entries(errorData).forEach(([field, messages]) => {
          messages.forEach((message) => {
            toast.error(`${field} خطأ في الحقل`, { pauseOnHover: false });
          });
        });
      } else {
        toast.error(error.message || "حدث خطأ ما", { pauseOnHover: false });
      }
      console.error("خطأ في إضافة طلب التسجيل:", errorData || error.message);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found in cookies");
        return;
      }

      const response = await axios.get(
        "https://bio.skyrsys.com/api/registration-requests/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      const registrationRequests = response.data;

      setTableData(registrationRequests);
    } catch (error) {
      console.error(
        "Error fetching registration requests:",
        error.response?.data || error.message
      );
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchData();
    } else {
      console.error("No token found in cookies");
    }
  }, [fetchData]);

  return (
    <>
      <div className="flex items-center">
        <main className="-mt-5 flex w-full flex-col lg:flex-row">
          <section className="flex-1">
            <EmployeTable
              openPreview={toggleOpenPreviewModal}
              openCreate={toggleOpenCreateModal}
              data={tableData}
            />
            <Suspense fallback={<div>Loading...</div>}>
              {openCreate && (
                <RegisterEmployee
                  closeModal={toggleOpenCreateModal}
                  modal={openCreate}
                  role={role}
                  handleSubmit={handleSubmit}
                />
              )}
              {openPreview && (
                <PreviewProject closeModal={toggleOpenPreviewModal} />
              )}
            </Suspense>
          </section>
          <ToastContainer />
        </main>
      </div>
    </>
  );
};

export default Projects;
