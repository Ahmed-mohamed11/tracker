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
import PlansTable from "./PlansTable";
import { ToastContainer } from "react-toastify";

const PreviewProject = lazy(() => import("./PreviewProjects"));
const AddPlans = lazy(() => import("./AddPlans"));
const EditPlane = lazy(() => import("./EditPlane"));

const Plans = ({ role }) => {
    const [openPreview, setOpenPreview] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [plansData, setPlansData] = useState([]); // لتخزين بيانات الخطط وعرضها في الجدول
    const [refreshData, setRefreshData] = useState(false);


    const toggleOpenCreateModal = useCallback(
        () => setOpenCreate((prev) => !prev),
        []
    );
    const toggleOpenPreviewModal = useCallback(
        () => setOpenPreview((prev) => !prev),
        []
    );

    const toggleOpenEditModal = useCallback(
        (plan) => {
            setSelectedPlan(plan);
            setOpenEdit((prev) => !prev);
        },
        []
    );



    const handlePlanUpdated = (updatedPlan) => {
        setPlansData((prevData) =>
            prevData.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan))
        );
        setOpenEdit(false); // إغلاق نافذة التعديل بعد تحديث البيانات
        setRefreshData(prev => !prev);
    };

    const handleAddPlan = () => {
        setRefreshData(prev => !prev); // تحديث refreshData عند إضافة شركة جديدة
    };

    // دالة لجلب البيانات من الخادم
    const fetchPlansData = useCallback(async () => {
        try {
            const response = await axios.get("https://api-url/plans"); // استبدل "https://api-url/plans" بعنوان الـ API الخاص بك
            setPlansData(response.data);
        } catch (error) {
            console.error("Error fetching plans data:", error);
        }
    }, []);



    // جلب البيانات عند تحميل الصفحة
    useEffect(() => {
        fetchPlansData();
    }, [fetchPlansData]);

    // تحديث الجدول بعد التعديل على الخطة



    return (
        <>
            <div className="flex items-center">
                <main className="-mt-5 flex w-full flex-col lg:flex-row">
                    <section className="flex-1">
                        <PlansTable
                            data={plansData} // تمرير بيانات الخطط لعرضها في الجدول
                            openPreview={toggleOpenPreviewModal}
                            openCreate={toggleOpenCreateModal}
                            openEdit={toggleOpenEditModal} // تمرير toggleOpenEditModal كخاصية
                            refreshData={refreshData} // تمرير refreshData هنا

                        />

                        <Suspense fallback={<div>Loading...</div>}>
                            {openCreate && (
                                <AddPlans
                                    closeModal={toggleOpenCreateModal}
                                    modal={openCreate}
                                    role={role}
                                    onAddPlan={handleAddPlan} // تمرير دالة handleAddPlan
                                />
                            )}
                            {openPreview && (
                                <PreviewProject closeModal={toggleOpenPreviewModal} />
                            )}

                            {openEdit && selectedPlan && (
                                <EditPlane
                                    closeModal={toggleOpenEditModal}
                                    modal={openEdit}
                                    planId={selectedPlan.id}
                                    planData={selectedPlan}
                                    onPlanUpdated={handlePlanUpdated}
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

export default Plans;
