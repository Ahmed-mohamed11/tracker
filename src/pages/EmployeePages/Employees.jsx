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
import { ToastContainer } from "react-toastify";

// const PreviewProjects = lazy(() => import("./PreviewProjects"));

const PreviewProject = lazy(() => import("./PreviewProjects"));
const RegisterEmployee = lazy(() => import("./RegisterEmployee"));

const Projects = ({ role }) => {
  const [openPreview, setOpenPreview] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  const handleDataRefresh = () => {
    setRefreshData(prev => !prev); // Toggle refresh state
  };

  const toggleOpenCreateModal = useCallback(
    () => setOpenCreate((prev) => !prev),
    [],
  );
  const toggleOpenPreviewModal = useCallback(
    () => setOpenPreview((prev) => !prev),
    [],
  );

  return (
    <>
      <div className="flex items-center">
        <main className="-mt-5 flex w-full flex-col lg:flex-row">
          <section className="flex-1">


            <EmployeTable
              openPreview={toggleOpenPreviewModal}
              openCreate={toggleOpenCreateModal}
              refreshData={refreshData}
            />
            <Suspense fallback={<div>Loading...</div>}>
              {openCreate && (
                <RegisterEmployee
                  closeModal={toggleOpenCreateModal}
                  modal={openCreate}
                  role={role}
                  onAddEmployee={handleDataRefresh}
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