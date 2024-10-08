'use client';
import { useState, useCallback } from "react";
import { X } from "@phosphor-icons/react";
import axios from 'axios';
import Cookies from 'js-cookie';
import FormText from "../../components/form/FormText";
 
const AddProjects = ({ closeModal, modal, onClientAdded }) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        job_number: "",
        job_title: "",
        phone_number: "",
        nationality: "",
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('لم يتم العثور على الرمز في الكوكيز');
                return;
            }

            const response = await axios.post('https://bio.skyrsys.com/api/registration-requests/', formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const newRegistration = response.data;
            console.log('تمت إضافة طلب التسجيل بنجاح:', newRegistration);
            onClientAdded(newRegistration);  // Call the callback to add the new client
            closeModal();

        } catch (error) {
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
                <div className="relative p-4 bg-white dark:bg-gray-800 sm:p-5" >
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600 shadow-md shadow-gray-300/10 ">
                        <h2>نموذج التسجيل</h2>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5  inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <X size={18} weight="bold" />
                            <span className="sr-only">إغلاق النافذة</span>
                        </button>
                    </div>
                    <div className="main-content-wrap mt-5" >
                        <form className="form-add-product text-right" onSubmit={handleSubmit} >
                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <FormText
                                    label="الاسم الأول"
                                    type="text"
                                    name="first_name"
                                    placeholder="الاسم الأول"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                                <FormText
                                    label="اسم العائلة"
                                    type="text"
                                    name="last_name"
                                    placeholder="اسم العائلة"
                                    value={formData.last_name}
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
                                <FormText
                                    label="رقم الوظيفة"
                                    type="text"
                                    name="job_number"
                                    placeholder="رقم الوظيفة"
                                    value={formData.job_number}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <FormText
                                    label="المسمى الوظيفي"
                                    type="text"
                                    name="job_title"
                                    placeholder="المسمى الوظيفي"
                                    value={formData.job_title}
                                    onChange={handleChange}
                                />
                                <FormText
                                    label="رقم الهاتف"
                                    type="tel"
                                    name="phone_number"
                                    placeholder="رقم الهاتف"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <FormText
                                    label="الجنسية"
                                    type="text"
                                    name="nationality"
                                    placeholder="الجنسية"
                                    value={formData.nationality}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 flex items-center"
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

export default AddProjects;
