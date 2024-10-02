import { useEffect, useState, useCallback } from "react";
import { X } from "@phosphor-icons/react";
import axios from 'axios';
import Cookies from 'js-cookie';
import FormText from "../../components/form/FormText";
import FormTextArea from "../../components/form/FormTextArea";
import Select from 'react-select';

const AddEntities = ({ closeModal, modal, onClientAdded }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        secondName: "",
        userName: "",
        email: "",
        jobTitle: "",
        jobNumber: "",
        phoneNumber: "",
        gender: [],
        employeeType: [],
    });

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);

    const handleMultiSelectChange = (name, selectedOptions) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: selectedOptions ? selectedOptions.map(option => option.value) : [],
        }));
    };

    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get('https://dashboard.cowdly.com/api/clients/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });

                setClients(response.data);
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };

        fetchClients();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.post('https://dashboard.cowdly.com/api/projects/', formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            const newProject = response.data;
            console.log('Client added successfully:', newProject);
            onClientAdded(newProject);
            closeModal();

        } catch (error) {
            console.error('Error adding project:', error.response?.data || error.message);
        }
    };

    const customStyles = {
        control: (base, state) => ({
            ...base,
            padding: '0.5rem',
            minHeight: '1rem',
            borderRadius: '0.375rem',
            borderColor: state.isFocused ? '#4caf50' : '#e5e7eb',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(72, 187, 120, 0.6)' : 'none',
            '&:hover': {
                borderColor: '#4caf50',
            },
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#d1fae5',
            borderRadius: '0.25rem',
            padding: '0.25rem',
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#065f46',
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#065f46',
            '&:hover': {
                backgroundColor: '#065f46',
                color: 'white',
            },
        }),
    };

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && closeModal()}
            id="createStudent"
            className={`fixed top-0 left-0 z-50 w-full h-full backdrop-blur-sm 
                ${modal ? "visible" : "invisible"}`}
        >
            <div
                className={`relative w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 overflow-auto h-screen
                ${modal ? "left-0" : "-left-full"} transition-all duration-500 ease-in-out`}
                style={{ transition: 'left 0.5s ease-in-out' }}
                dir="rtl"
            >
                <div className="relative  p-4 sm:p-5">
                    <div className="flex  justify-between items-center pb-4 mb-4 rounded-t border-b dark:border-gray-600 shadow-md shadow-gray-300/10">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <X size={18} weight="bold" />
                            <span className="sr-only">Close modal</span>
                        </button>
                        <h2 className="text-xl font-semibold">إضافة جهه</h2>
                    </div>
                    <div className="main-content-wrap mt-5">
                        <form className="form-add-product text-right" onSubmit={handleSubmit}>
                            {/* Form content */}
                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <FormText
                                    label="اسم الجهه بالعربي"
                                    type="text"
                                    name="firstName"
                                    placeholder=" الاسم بالعربي"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="border rounded-lg"
                                />

                                <FormText
                                    label="اسم الجهه بالانجليزيه"
                                    type="text"
                                    name="secondName"
                                    placeholder=" الاسم بالانجليزيه"
                                    value={formData.secondName}
                                    onChange={handleChange}
                                    className="border rounded-lg"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        اختيار الجهه
                                    </label>
                                    <Select
                                        isMulti
                                        name="gender"
                                        value={formData.gender.map(g => ({
                                            value: g,
                                            label: g === 'male' ? 'ذكر' : 'أنثى',
                                        }))}
                                        options={[
                                            { value: "male", label: "ذكر" },
                                            { value: "female", label: "أنثى" },
                                        ]}
                                        onChange={(selectedOptions) =>
                                            handleMultiSelectChange("gender", selectedOptions)
                                        }
                                        classNamePrefix="select"
                                        styles={customStyles}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        نوع الموظف
                                    </label>
                                    <Select
                                        isMulti
                                        name="employeeType"
                                        value={formData.employeeType.map(e => ({
                                            value: e,
                                            label: e,
                                        }))}
                                        options={[
                                            { value: "engineer", label: "مهندس" },
                                            { value: "technician", label: "فني" },
                                            { value: "office", label: "إداري" },
                                        ]}
                                        onChange={(selectedOptions) =>
                                            handleMultiSelectChange("employeeType", selectedOptions)
                                        }
                                        classNamePrefix="select"
                                        styles={customStyles}
                                    />
                                </div>
                            </div>






                            <div className="w-full flex justify-start mt-5">
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none"
                                    type="submit"
                                >
                                    اضافه الجهه
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
