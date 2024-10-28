"use client";
import { useCallback, useState, useEffect, lazy, Suspense, useMemo } from "react";
import gsap from "gsap";
import CompaniesTable from "./CompanieTable";
import { ToastContainer } from "react-toastify";

// Lazy load components
const PreviewProject = lazy(() => import("./PreviewProjects"));
const AddCompanies = lazy(() => import("./AddCompanies"));

const Companies = ({ role }) => {
    const [openPreview, setOpenPreview] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

    const toggleOpenCreateModal = useCallback(() => setOpenCreate((prev) => !prev), []);
    const toggleOpenPreviewModal = useCallback(() => setOpenPreview((prev) => !prev), []);

    // Function to be called when a new company is added
    // const handleDataRefresh = () => {
    //     setRefreshData(prev => !prev); // Toggle refresh state
    // };

    const handleAddCompany = () => {
        setRefreshData(prev => !prev); // تحديث refreshData عند إضافة شركة جديدة
    };

    return (
        <div className="flex items-center">
            <main className="-mt-5 flex w-full flex-col lg:flex-row">
                <section className="flex-1">
                    <CompaniesTable
                        openPreview={toggleOpenPreviewModal}
                        openCreate={toggleOpenCreateModal}
                        refreshData={refreshData} // تمرير refreshData هنا
                    />
                    <Suspense fallback={<div>Loading...</div>}>
                        {openCreate && (
                            <AddCompanies
                                closeModal={toggleOpenCreateModal}
                                modal={openCreate}
                                role={role}
                                onAddCompany={handleAddCompany} // تمرير دالة handleAddCompany
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
    );
};


export default Companies;
