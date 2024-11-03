'use client';
import { useState, useEffect, useCallback } from "react";
import { X } from "@phosphor-icons/react";
import axios from 'axios';
import Cookies from 'js-cookie';
import FormText from "../../../../components/form/FormText";
import FormSelect from "../../../../components/form/FormSelect";
import FormPic from "../../../../components/form/FormPic";
import { toast } from 'react-toastify';

const AddCompanies = ({ closeModal, modal, onAddCompany }) => {
    const [formData, setFormData] = useState({
        email: "",
        company_code: "",
        company_name: "",
        company_logo: null,
        plan: 1,
    });

    const [plans, setPlans] = useState([]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'plan' ? parseInt(value, 10) : value,
        }));
    }, []);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        setFormData(prevData => ({ ...prevData, company_logo: file }));
    }, []);

    const getPlans = useCallback(async () => {
        try {
            const response = await axios.get('https://bio.skyrsys.com/api/plan/plans/', {
                headers: { 'Authorization': `Token ${Cookies.get('token')}` },
            });
            setPlans(response.data);
        } catch (error) {
            console.error('Error getting plans:', error.response?.data || error.message);
            setPlans([]);
        }
    }, []);

    useEffect(() => {
        getPlans();
    }, [getPlans]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('لم يتم العثور على الرمز في الكوكيز');
                return;
            }
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) data.append(key, value);
            });

            const response = await axios.post('https://bio.skyrsys.com/api/superadmin/companies/', data, {
                headers: { 'Authorization': `Token ${token}` },
            });
            toast.success('تمت إضافة طلب التسجيل بنجاح');
            console.log('تمت إضافة طلب التسجيل بنجاح:', response.data);
            onAddCompany(); // Call the function to refresh data
            closeModal();
        } catch (error) {
            toast.error('خطأ في إضافة طلب التسجيل');
            console.error('خطأ في إضافة طلب التسجيل:', error.response?.data || error.message);
        }
    };


    return (
        <div
            onClick={(e) => e.target === e.currentTarget && closeModal()}
            id="createStudent"
            className={`createStudent overflow-y-auto overflow-x-hidden duration-200 ease-linear
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
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">اضافة شركه</h2>
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
                                    label="اسم الشركه"
                                    type="text"
                                    name="company_name"
                                    placeholder="اسم الشركه"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                />
                                <FormText
                                    label="كود الشركه"
                                    type="text"
                                    name="company_code"
                                    placeholder="كود الشركه"
                                    value={formData.company_code}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <FormText
                                    label="البريد الإلكتروني"
                                    type="email"
                                    name="email"
                                    placeholder="البريد الإلكتروني"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <FormPic
                                    label="صورة الشركه"
                                    name="company_logo"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <FormSelect
                                    label="نوع الخطة"
                                    name="plan"
                                    options={plans.map(plan => ({
                                        value: plan.id,
                                        label: `${plan.type} - ${plan.name}`,
                                    }))}
                                    onChange={handleChange}
                                    value={formData.plan}
                                />
                            </div>

                            <button
                                className="bg-themeColor-600 text-white px-4 py-2 rounded-md hover:bg-themeColor-700 transition duration-200 flex items-center"
                                type="submit"
                            >
                                إرسال الطلب
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCompanies;
