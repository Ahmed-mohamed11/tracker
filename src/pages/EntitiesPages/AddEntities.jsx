import { useState } from "react";
import { X } from "@phosphor-icons/react";
import axios from 'axios';
import Cookies from 'js-cookie';
import FormText from "../../components/form/FormText";
import { useI18nContext } from "../../context/i18n-context";
import Select from 'react-select';

const AddEntities = ({ closeModal, modal, onClientAdded }) => {
    const [formData, setFormData] = useState({
        firstName: "",   // الاسم بالعربي
        secondName: "",  // الاسم بالإنجليزي
        shifts: ["All"], // المناوبات
        employeeType: [], // نوع الموظفين
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
                ar_name: formData.firstName,  // اسم الجهة بالعربية
                en_name: formData.secondName, // اسم الجهة بالإنجليزية
                shifts: selectedShifts.map(shift => shift.value), // المناوبات المحددة
                employeeType: selectedEmployeeTypes.map(type => type.value), // نوع الموظفين
            };

            // استدعاء الـ API باستخدام Axios
            const response = await axios.post('https://bio.skyrsys.com/api/entity/', requestData, {
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
                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <FormText
                                    label="اسم الجهة بالعربي"
                                    type="text"
                                    name="firstName"
                                    placeholder=" الاسم بالعربي"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="border rounded-lg"
                                />

                                <FormText
                                    label="اسم الجهة بالإنجليزية"
                                    type="text"
                                    name="secondName"
                                    placeholder=" الاسم بالإنجليزية"
                                    value={formData.secondName}
                                    onChange={(e) => setFormData({ ...formData, secondName: e.target.value })}
                                    className="border rounded-lg"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        المناوبات
                                    </label>
                                    <Select
                                        isMulti
                                        name="shifts"
                                        options={[
                                            { value: "male", label: t('registrationForm.shiftsOptions.male') },
                                            { value: "female", label: t('registrationForm.shiftsOptions.female') },
                                        ]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        value={selectedShifts}
                                        onChange={handleSelectShiftsChange}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        الموظفين
                                    </label>
                                    <Select
                                        isMulti
                                        name="Shifts"
                                        options={[
                                            { value: "male", label: t('registrationForm.shiftsOptions.male') },
                                            { value: "female", label: t('registrationForm.shiftsOptions.female') },
                                        ]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        value={selectedEmployeeTypes}
                                        onChange={handleSelectEmployeeTypesChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="mt-3">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">المناوبات</label>
                                    <div className="flex gap-2">
                                        {selectedShifts.map((shifts, index) => (
                                            <span key={index} className="px-2 py-1 text-gray-50 bg-themeColor-500 rounded-lg">
                                                {shifts.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">الموظفين</label>
                                    <div className="flex gap-2">
                                        {selectedEmployeeTypes.map((employeeType, index) => (
                                            <span key={index} className="px-2 py-1 text-gray-50 bg-themeColor-500 rounded-lg">
                                                {employeeType.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5 mt-5">
                                <div className="mt-3">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">رابط GPS</label>
                                    <input
                                        type="text"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="https://www.example.com"
                                    />
                                </div>
                            </div>

                            <div className="w-full flex justify-start mt-5">
                                <button
                                    className="bg-themeColor-600 text-white px-4 py-2 rounded-md hover:bg-themeColor-700 focus:outline-none"
                                    type="submit"
                                >
                                    إضافة الجهة
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
