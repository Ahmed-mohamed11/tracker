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
import EntitiesTable from "./EntitiesTable";
import { ToastContainer } from "react-toastify";


const PreviewProject = lazy(() => import("./PreviewProjects"));
const AddEntities = lazy(() => import("./AddEntities"));

const Entities = ({ role }) => {
    const [openPreview, setOpenPreview] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [refreshData, setRefreshData] = useState(false);


    const toggleOpenCreateModal = useCallback(
        () => setOpenCreate((prev) => !prev),
        [],
    );

    const toggleOpenPreviewModal = useCallback(
        () => setOpenPreview((prev) => !prev),
        [],
    );


    const handleAddEntity = () => {
        console.log('handleAddEntity', handleAddEntity);
        setRefreshData(prev => !prev); // تحديث refreshData عند إضافة شركة جديدة
    };



    return (
        <>
            <div className="flex  items-center">
                <main className="-mt-5 flex w-full flex-col lg:flex-row">
                    <section className="flex-1">


                        <EntitiesTable
                            openCreate={toggleOpenCreateModal}
                            refreshData={refreshData} />
                        {openCreate && <AddEntities closeModal={toggleOpenCreateModal} />}

                        <Suspense fallback={<div>Loading...</div>}>
                            {openCreate && (
                                <AddEntities
                                    closeModal={toggleOpenCreateModal}
                                    modal={openCreate}
                                    role={role}
                                    onAddEntity={handleAddEntity} // تمرير دالة handleAddCompany
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

export default Entities;
