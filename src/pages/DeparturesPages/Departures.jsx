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
import DeparturesTable from "./DeparturesTable";
import { ToastContainer } from "react-toastify";

const PreviewProject = lazy(() => import("./PreviewProjects"));
const AddDepartures = lazy(() => import("./AddDepartures"));

const Departures = ({ role }) => {
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



    const chartSection = useMemo(
        () => (
            <div className="flex flex-col flex-wrap items-center justify-between gap-4 md:flex-row lg:flex-row xl:flex-row"></div>
        ),
        [],
    );

    return (
        <>
            <div className="flex  items-center">
                <main className="-mt-5 flex w-full flex-col lg:flex-row">
                    <section className="flex-1">


                        <DeparturesTable
                            openPreview={toggleOpenPreviewModal}
                            openCreate={toggleOpenCreateModal}
                            refreshData={refreshData}
                        />
                        <Suspense fallback={<div>Loading...</div>}>
                            {openCreate && (
                                <AddDepartures
                                    closeModal={toggleOpenCreateModal}
                                    modal={openCreate}
                                    onDepartureAdd={handleDataRefresh}
                                    role={role}
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

export default Departures;
