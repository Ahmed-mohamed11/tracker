'use client';
import { useState, useCallback, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import axios from 'axios';
import Cookies from 'js-cookie';
import FormText from "../../components/form/FormText";
import FormSelect from "../../components/form/FormSelect";
import FormTextArea from "../../components/form/FormTextArea";


const AddProjects = ({ closeModal, modal, onClientAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        client: "", // سيتم تخزين id العميل هنا
        description: "",
    });

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);






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
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            const token = Cookies.get('token'); // Retrieve token from cookies
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.post('https://dashboard.cowdly.com/api/projects/', formData, {
                headers: {
                    'Authorization': `Token ${token}`, // Include token in the request header
                },
            });

            const newProject = response.data;
            console.log('Client added successfully:', newProject);
            onClientAdded(newProject); // Pass the new client data to the parent component
            closeModal(); // Close the modal on successful submission

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
                className={`rounded-l-[15px] p-4 w-full max-w-[55rem] pb-10 bg-white
                dark:bg-gray-800 rounded-r-lg duration-200 ease-linear
                ${modal ? "fixed right-0" : "absolute -left-full"}
                h-screen overflow-auto`}
                dir="rtl"
            >
                <div className="relative p-4 bg-white dark:bg-gray-800 sm:p-5">
                    <div className=" flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600 shadow-md shadow-gray-300/10 ">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <X size={18} weight="bold" />
                            <span className="sr-only">Close modal</span>
                        </button>
                        <h2> Add Employee </h2>
                    </div>
                    <div className="main-content-wrap mt-5">
                        <form className="form-add-product text-left" onSubmit={handleSubmit}>
                            {/* Form content */}
                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <FormText label="First Name" type={"text"} name="firstName" placeholder={"Enter First Name"} value={formData.firstName} onChange={handleChange} />
                                <FormText label="Second Name" type={"text"} name="secondName" placeholder={"Enter Second Name"} value={formData.secondName} onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <FormText label="User Name" type={"text"} name="userName" placeholder={"Enter User Name"} value={formData.userName} onChange={handleChange} />
                                <FormText label="Email" type={"email"} name="email" placeholder={"Enter Email"} value={formData.email} onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <FormText label="Job Title" type={"text"} name="jobTitle" placeholder={"Enter Job Title"} value={formData.jobTitle} onChange={handleChange} />
                                <FormText label="Job Number" type={"text"} name="jobNumber" placeholder={"Enter Job Number"} value={formData.jobNumber} onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <FormText label="Phone Number" type={"tel"} name="phoneNumber" placeholder={"Enter Phone Number"} value={formData.phoneNumber} onChange={handleChange} />
                                <FormSelect
                                    label="Gender"
                                    value={formData.gender}
                                    name="gender" // Use a constant string here to match the form field name
                                    onChange={handleChange}
                                    options={[
                                        { value: "male", label: "Male" },
                                        { value: "female", label: "Female" },
                                    ]}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-3">
                                <FormSelect
                                    label="Responsible Party"
                                    value={formData.responsibleParty}
                                    name="responsibleParty" // Use a constant string here to match the form field name
                                    onChange={handleChange}
                                    options={clients.map(client => ({
                                        value: client.id, // ID of the client
                                        label: client.name // Name of the client
                                    }))}
                                />

                                <FormSelect
                                    label="Employee Type"
                                    value={formData.employeeType}
                                    name="employeeType" // Use a constant string here to match the form field name
                                    onChange={handleChange}
                                    options={[
                                        { value: "engineer", label: "Engineer" },
                                        { value: "technician", label: "Technician" },
                                        { value: "office", label: "Office" },
                                    ]}
                                />


                            </div>

                            {/**
                             <FormSelect
                                label="Project Client"
                                value={formData.client}
                                name="client" // Use a constant string here to match the form field name
                                onChange={handleChange}
                                options={clients.map(client => ({
                                    value: client.id, // ID of the client
                                    label: client.name // Name of the client
                                }))}
                            />
                             */}

                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center"
                                type="submit"><i className="icon-plus"></i>Add New</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProjects;
