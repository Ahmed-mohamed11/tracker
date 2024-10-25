import { useCallback, useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import axios from 'axios';
import Cookies from 'js-cookie';
import FormText from "../../components/form/FormText";
import { useI18nContext } from "../../context/i18n-context";
import Select from 'react-select';
import FormSelect from "../../components/form/FormSelect";

const AddEntities = ({ closeModal, modal, onClientAdded }) => {
    const [formData, setFormData] = useState({
        text: "",
        lang: "",
    });

    const { t } = useI18nContext();

    const [selectedShifts, setSelectedShifts] = useState([]);
    const [selectedEmployeeTypes, setSelectedEmployeeTypes] = useState([]);

    const handleSelectShiftsChange = (selectedOptions) => {
        setSelectedShifts(selectedOptions);
    };

    const handleSelectEmployeeTypesChange = (selectedOptions) => {
        setSelectedEmployeeTypes(selectedOptions);
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'entity' ? parseInt(value, 10) : value, // تحويل القيمة إلى integer إذا كان الاسم هو 'entity'
        }));
    }, []); axios


    const [branch, setBranch] = useState([]); // الحالة لتخزين الجهات

    const getEntities = useCallback(async () => {
        try {
            const response = await axios.get('https://bio.skyrsys.com/api/branch/branches/', {
                headers: {
                    'Authorization': `Token ${Cookies.get('token')}`,
                },
            });
            setBranch(response.data);
        } catch (error) {
            console.error('Error getting entities:', error.response?.data || error.message);
            setBranch([]);
        }
    }, []);

    useEffect(() => {
        getEntities();
    }, [getEntities]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // استرجاع التوكن من الكوكيز
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            // البيانات التي سيتم إرسالها للـ API
            const requestData = {
                text: formData.text,  // اسم الجهة بالعربية
                lang: formData.lang, // اسم الجهة بالإنجليزية

            };

            // استدعاء الـ API باستخدام Axios
            const response = await axios.post('https://bio.skyrsys.com/api/company/voices/', requestData, {
                headers: {
                    'Authorization': `Token ${token}`,  // إرسال التوكن في الهيدر
                },
            });

            // عرض النتيجة أو تحديث الجداول
            const newEntity = response.data;
            console.log('Entity added successfully:', newEntity);
            onClientAdded(newEntity);
            closeModal();  // إغلاق النموذج بعد الإرسال

        } catch (error) {
            console.error('Error adding entity:', error.response?.data || error.message);
        }
    };

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && closeModal()}
            id="createStudent"
            className={`fixed top-0 left-0 z-50 w-full h-full backdrop-blur-sm 
                ${modal ? "visible" : "invisible"}`}
        >
            <div
                className={`absolute top-0 left-0 w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 overflow-auto h-screen
                ${modal ? "translate-x-0" : "-translate-x-full"} transition-transform duration-500 ease-in-out`}
                style={{ transition: 'left 0.5s ease-in-out' }}
                dir="rtl"
            >
                <div className="relative p-4 sm:p-5">
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b dark:border-gray-600 shadow-md shadow-gray-300/10">
                        <h2 className="text-xl text-gray-900 font-semibold">إضافة جهة</h2>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <X size={18} weight="bold" />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="main-content-wrap mt-5">
                        <form className="form-add-product text-right" onSubmit={handleSubmit}>
                            <div className="">
                                <FormText
                                    label="ادخل النص"
                                    type="text"
                                    name="text"
                                    placeholder=" النص "
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    className="border rounded-lg"
                                />
                            </div>
                            <div className="">
                                <FormSelect
                                    label="اللغة"
                                    name="lang"
                                    onChange={handleChange}
                                    options={[
                                        { value: 'en', label: 'English' },
                                        { value: 'ar', label: 'عربي' },
                                    ]}
                                    value={formData.lang}
                                />
                            </div>

                            <div className="w-full flex justify-start mt-5">
                                <button
                                    className="bg-themeColor-600 text-white px-4 py-2 rounded-md hover:bg-themeColor-700 focus:outline-none"
                                    type="submit"
                                >
                                    إضافة الصوت
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEntities;
