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
import BranchesTable from "./BranchTable";
import { ToastContainer } from "react-toastify";
const PreviewProject = lazy(() => import("./PreviewProjects"));
const AddBranches = lazy(() => import("./AddBranch"));
const Branches = ({ role }) => {
    const [openPreview, setOpenPreview] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [refreshData, setRefreshData] = useState(false);



    const toggleOpenCreateModal = useCallback(
        () => setOpenCreate((prev) => !prev),
        []
    );

    const toggleOpenPreviewModal = useCallback(
        () => setOpenPreview((prev) => !prev),
        []
    );

    const handleAddBranch = () => {
        setRefreshData(prev => !prev);
    }

    return (
        <div className="flex items-center">
            <main className="-mt-5 flex w-full flex-col lg:flex-row">
                <section className="flex-1">
                    <BranchesTable
                        openPreview={toggleOpenPreviewModal}
                        openCreate={toggleOpenCreateModal}
                        refreshData={refreshData}
                    />
                    <Suspense fallback={<div>Loading...</div>}>
                        {openCreate && (
                            <AddBranches
                                closeModal={toggleOpenCreateModal}
                                modal={openCreate}
                                role={role}
                                onAddBranch={handleAddBranch}


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

export default Branches;
