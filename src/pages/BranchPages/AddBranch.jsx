"use client";
import { useState, useEffect, useCallback } from "react";
import { X } from "@phosphor-icons/react";
import axios from "axios";
import Cookies from "js-cookie";
import FormText from "../../components/form/FormText";
import { toast } from "react-toastify";
const AddBranch = ({ closeModal, modal, onAddBranch }) => {
    const [formData, setFormData] = useState({
        branch_name: "",
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get("token");
            if (!token) {
                console.error("لم يتم العثور على الرمز في الكوكيز");
                return;
            }

            const data = {
                branch_name: formData.branch_name,
            };

            const response = await axios.post(
                "https://bio.skyrsys.com/api/branch/branches/",
                data,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            closeModal();
            toast.success("تمت إضافة الخطة بنجاح");

            onAddBranch(response.data); // Use the actual response data
        } catch (error) {
            toast.error("حدث خطأ أثناء إضافة الفرع");
            console.error(
                "Error adding branch:",
                error.response?.data || error.message
            );
        }
    };

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && closeModal()}
            id="createBranch"
            className={`createBranch overflow-y-auto overflow-x-hidden duration-200 ease-linear
                shadow-2xl shadow-slate-500 
                backdrop-blur-sm backdrop-saturate-[180%]
                dark:shadow-white/[0.10] dark:backdrop-blur-sm dark:backdrop-saturate-[180%] 
                fixed top-0 left-0 z-50 justify-center items-center
                w-full h-full ${modal ? "visible" : "invisible"}`}>
            <div
                style={{ boxShadow: "black 19px 0px 45px -12px" }}
                className={`rounded-l-[15px] p-4 w-full max-w-[45rem] pb-10 bg-white
                dark:bg-gray-800 rounded-r-lg duration-200 ease-linear
                ${modal ? "fixed left-0" : "absolute -left-full"}
                h-screen overflow-auto`}
                dir="rtl">
                <div className="relative p-4 bg-white dark:bg-gray-800 sm:p-5">
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600 shadow-md shadow-gray-300/10">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            إضافة فرع
                        </h2>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <X size={18} weight="bold" />
                            <span className="sr-only">إغلاق النافذة</span>
                        </button>
                    </div>
                    <div className="main-content-wrap mt-5">
                        <form
                            className="form-add-product text-right"
                            onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <FormText
                                    label="اسم الفرع"
                                    type="text"
                                    name="branch_name"
                                    placeholder="اسم الفرع"
                                    value={formData.branch_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                className="bg-themeColor-600 text-white px-4 py-2 rounded-md hover:bg-themeColor-700 transition duration-200 flex items-center"
                                type="submit">
                                إرسال الطلب
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBranch;
