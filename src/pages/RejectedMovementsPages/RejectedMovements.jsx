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
import RejectedMovementsTable from "./RejectedMovementsTable";

// const PreviewProject = lazy(() => import("./PreviewRejectedMovements"));
// const AddDepartures = lazy(() => import("./AddDepartures"));

const RejectedMovements = ({ role }) => {
    const [openPreview, setOpenPreview] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);

    const toggleOpenCreateModal = useCallback(
        () => setOpenCreate((prev) => !prev),
        [],
    );
    const toggleOpenPreviewModal = useCallback(
        () => setOpenPreview((prev) => !prev),
        [],
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            const ctx = gsap.context(() => {
                gsap.fromTo(
                    ".chart-container",
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 1, stagger: 0.2 },
                );
            });

            return () => ctx.revert();
        }
    }, []);

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


                        <RejectedMovementsTable
                            openPreview={toggleOpenPreviewModal}
                            openCreate={toggleOpenCreateModal}
                        />

                        {/*
                        <Suspense fallback={<div>Loading...</div>}>
                            {openCreate && (
                                <AddDepartures
                                    closeModal={toggleOpenCreateModal}
                                    modal={openCreate}
                                    role={role}
                                />
                            )}
                            {openPreview && (
                                <PreviewProject closeModal={toggleOpenPreviewModal} />
                            )}
                        </Suspense>
                        */}
                    </section>
                </main>
            </div>
        </>
    );
};

export default RejectedMovements;
