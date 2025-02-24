"use client";
import { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import axios from 'axios';
import Cookies from 'js-cookie';
import FormText from "../../../../components/form/FormText";
import FormNumber from "../../../../components/form/FormNumber";
import FormSelect from "../../../../components/form/FormSelect";
import { toast } from 'react-toastify';

const EditPlane = ({ closeModal, modal, onPlanUpdated, planId }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        type: 'monthly', // القيمة الافتراضية لنوع الخطة
        max_branches: 3,
        max_employees: 10,
    });

    // جلب بيانات الخطة عند فتح النافذة
    useEffect(() => {
        const fetchPlanData = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    console.error('Token not found in cookies');
                    return;
                }
                const response = await axios.get(`https://bio.skyrsys.com/api/plan/plans/${planId}/`, {
                    headers: { 'Authorization': `Token ${token}` },
                });
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching plan data:', error.response?.data || error.message);
            }
        };

        if (modal && planId) {
            fetchPlanData();
        }
    }, [modal, planId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('Token not found in cookies');
                return;
            }

            const response = await axios.put(`https://bio.skyrsys.com/api/plan/plans/${planId}/`, formData, {
                headers: { 'Authorization': `Token ${token}` },
            });

            toast.success('تم تحديث الخطة بنجاح');
            onPlanUpdated(); // تحديث الجدول ببيانات الخطة المعدلة
            closeModal();
        } catch (error) {
            console.error('Error updating plan:', error.response?.data || error.message);
            toast.error('خطأ في تحديث الخطة');
        }
    };

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && closeModal()}
            id="editPlan"
            className={`createPlan overflow-y-auto overflow-x-hidden duration-200 ease-linear
                shadow-2xl shadow-slate-500 
                backdrop-blur-sm backdrop-saturate-[180%]
                dark:shadow-white/[0.10] dark:backdrop-blur-sm dark:backdrop-saturate-[180%] 
                fixed top-0 left-0 z-50 justify-center items-center
                w-full h-full ${modal ? "visible" : "invisible"}`}
        >
            <div
                style={{ boxShadow: "black 19px 0px 45px -12px" }}
                className={`rounded-l-[15px] p-4 w-full max-w-[45rem] pb-10 bg-white
                dark:bg-gray-800 rounded-r-lg duration-200 ease-linear
                ${modal ? "fixed left-0" : "absolute -left-full"}
                h-screen overflow-auto`}
                dir="rtl"
            >
                <div className="relative p-4 bg-white dark:bg-gray-800 sm:p-5">
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600 shadow-md shadow-gray-300/10">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">تعديل الخطة</h2>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <X size={18} weight="bold" />
                            <span className="sr-only">إغلاق النافذة</span>
                        </button>
                    </div>
                    <div className="main-content-wrap mt-5">
                        <form className="form-add-product text-right" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <FormText
                                    label="اسم الخطة"
                                    type="text"
                                    name="name"
                                    placeholder="اسم الخطة"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                <FormText
                                    label="السعر"
                                    type="text"
                                    name="price"
                                    placeholder="السعر"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <FormNumber
                                    label="عدد الفروع القصوى"
                                    type="number"
                                    name="max_branches"
                                    placeholder="عدد الفروع القصوى"
                                    value={formData.max_branches}
                                    onChange={handleChange}
                                />
                                <FormNumber
                                    label="عدد الموظفين الأقصى"
                                    type="number"
                                    name="max_employees"
                                    placeholder="عدد الموظفين الأقصى"
                                    value={formData.max_employees}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-700 dark:text-gray-300">نوع الخطة</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200 "
                                >
                                    <option value="monthly">شهري</option>
                                    <option value="yearly">سنوي</option>
                                </select>



                            </div>
                            <button
                                className="bg-themeColor-600 text-white px-4 py-2 rounded-md hover:bg-themeColor-700 transition duration-200 flex items-center"
                                type="submit"
                            >
                                تحديث الخطة
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPlane;
