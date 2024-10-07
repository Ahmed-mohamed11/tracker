'use client';
import { useState, useCallback, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import axios from 'axios';
import Cookies from 'js-cookie';
import FormText from "../../components/form/FormText";
// import FormSelect from "../../components/form/FormSelect";
import FormTextArea from "../../components/form/FormTextArea";
import { useI18nContext } from "../../context/i18n-context";

const AddProjects = ({ closeModal, modal, onClientAdded }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        secondName: "",
        userName: "",
        email: "",
        jobTitle: "",
        jobNumber: "",
        phoneNumber: "",
        gender: "",
        responsibleParty: "",
        employeeType: "",
    });

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);

    const { t } = useI18nContext();

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
            console.log('Project added successfully:', newProject);
            onClientAdded(newProject);
            closeModal();

        } catch (error) {
            console.error('Error adding project:', error.response?.data || error.message);
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
                className={`rounded-l-[15px] p-4 w-full max-w-[35rem] pb-10 bg-white
                dark:bg-gray-800 rounded-r-lg duration-200 ease-linear
                ${modal ? "fixed left-0" : "absolute -left-full"}
                h-screen overflow-auto`}
                dir="rtl"
            >
                <div className="relative p-4 bg-white dark:bg-gray-800 sm:p-5">
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600 shadow-md shadow-gray-300/10 ">
                        <h2>اضافه مجموعه مواقع جديده</h2>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5  inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <X size={18} weight="bold" />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="main-content-wrap mt-5">
                        <form className="form-add-product text-right" onSubmit={handleSubmit}>
                            {/* Form content */}

                            <div className="mb-5">
                                <FormText
                                    label="الاسم بالعربي"
                                    type="text"
                                    name="firstName"
                                    placeholder="الاسم بالعربي"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="mb-4"
                                />
                            </div>

                            <div className="mb-5">
                                <FormText
                                    label="الاسم بالانجليزي"
                                    placeholder="الاسم بالانجليزي"
                                    type="text"
                                    name="secondName"
                                    value={formData.secondName}
                                    onChange={handleChange}
                                    className="mt-10"
                                />
                            </div>

                            <div className="mb-5">

                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="attendance-time">
                                    وقت الحضور والانصراف
                                </label>
                                <input
                                    type="time"
                                    name="attendanceTime"
                                    id="attendance-time"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={formData.attendanceTime}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="mb-5">
                                <FormTextArea
                                    label="الوصف"
                                    type="email"
                                    name="email"
                                    placeholder={t('registrationForm.fields.email')}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-5">
                                <div className=" col-span-2">
                                    <p className="text-lg font-medium text-gray-900 dark:text-gray-300">الحاله</p>
                                </div>
                                <label className=" col-span-1 px-4 py-2 rounded-full bg-green-300 inline-flex items-center cursor-pointer" >
                                    <input type="checkbox" value="" className="sr-only peer" />
                                    <span className="me-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span>
                                    <div className="relative w-11 h-6 bg-gray-200  dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 flex items-center"
                                type="submit"
                            >
                                {t('registrationForm.submitButton')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProjects;
