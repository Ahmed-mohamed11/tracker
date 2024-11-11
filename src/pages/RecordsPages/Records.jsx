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
import RecordsTable from "./RecordsTable";

const PreviewProject = lazy(() => import("./PreviewProjects"));
const AddRecords = lazy(() => import("./AddRecords"));

const Records = ({ role }) => {
    const [openPreview, setOpenPreview] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

    const handleDataRefresh = () => {
        setRefreshData(prev => !prev); // Toggle refresh state
    };

    const toggleOpenCreateModal = useCallback(
        () => setOpenCreate((prev) => !prev),
    );
    const toggleOpenPreviewModal = useCallback(
        () => setOpenPreview((prev) => !prev),
        [],
    );


    return (
        <>
            <div className="flex  items-center">
                <main className="-mt-5 flex w-full flex-col lg:flex-row">
                    <section className="flex-1">
                        <RecordsTable openCreate={toggleOpenCreateModal}
                            refreshData={refreshData}
                        />
                        {openCreate && <AddRecords closeModal={toggleOpenCreateModal} />}

                        <Suspense fallback={<div>Loading...</div>}>
                            {openCreate && (
                                <AddRecords
                                    closeModal={toggleOpenCreateModal}
                                    modal={openCreate}
                                    onRecordAdded={handleDataRefresh}
                                    role={role}
                                />
                            )}
                            {openPreview && (
                                <PreviewProject closeModal={toggleOpenPreviewModal} />
                            )}
                        </Suspense>
                    </section>
                </main>
            </div>
        </>
    );
};

export default Records;
