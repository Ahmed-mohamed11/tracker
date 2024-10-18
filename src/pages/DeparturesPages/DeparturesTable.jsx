import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AddDepartures from './AddDepartures';
import PreviewProjects from './PreviewProjects';
import Table from '../../components/Table';

import { FaPlus } from "react-icons/fa";
import FormText from "../../components/form/FormText";
import FormSelect from '../../components/form/FormSelect';



const ProjectTable = ({ openPreview, openCreate }) => {
    const [modalType, setModalType] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }


            const [projectsResponse, clientsResponse] = await Promise.all([
                axios.get('https://dashboard.cowdly.com/api/projects/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                }),
                axios.get('https://dashboard.cowdly.com/api/clients/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                })
            ]);

            const projects = projectsResponse.data;
            const clientsData = clientsResponse.data;

            setClients(clientsData);

            if (projects.length > 0) {
                const headers = Object.keys(projects[0]);
                setTableHeaders(headers.map(header => ({ key: header, label: header })));

                const formattedProjects = projects.map(project => {
                    const client = clientsData.find(c => c.id === project.client);
                    return {
                        ...project,
                        client: client ? client.name : 'Unknown Client'
                    };
                });

                setTableData(formattedProjects);
            } else {
                setTableHeaders([]);
                setTableData([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error.response?.data || error.message);
        }
    }, []);

    const handleOpenCreate = () => {
        console.log('Open Create button clicked');
        openCreate();
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addNewProjectToTable = (newProject) => {
        const client = clients.find(c => c.id === newProject.client);
        const formattedProject = {
            ...newProject,
            client: client ? client.name : 'Unknown Client'
        };
        setTableData((prevData) => [...prevData, formattedProject]);
    };

    return (
        <div className="min-h-screen mt-6 font-sans lg:max-w-7xl w-full mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div className="w-full flex items-center justify-between p-4 bg-themeColor-500  border-b ">

                    <h2 className="text-xl font-bold">المغادرات</h2>
                    <button
                        className="fflex items-center justify-center p-2 rounded-full bg-themeColor-600 text-white hover:bg-themeColor-700 transition duration-200"
                        onClick={handleOpenCreate}
                    >
                        <FaPlus className="h-6 w-6 " />

                    </button>

                </div>
            </div>


            <div className="mb-6 grid justify-end grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <FormText label="الإسم الأول" type={"text"} name="firstName" placeholder={"الإسم الأول"} />

                <FormSelect
                    label="اختر الوظيفه "
                    name="gender"
                    options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                    ]}
                />
                <FormSelect
                    label="اختر الجهه"
                    name="gender"
                    options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                    ]}
                />

            </div>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">

                <FormSelect
                    label="نوع الطلب "
                    name="gender"
                    options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                    ]}
                />

                <div className='flex flex-col justify-end items-start  text-right'>
                    <label className="block  mb-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"> تاريخ المغادرة</label>
                    <input type="date" className=" bg-gray-50 border border-gray-300
                        text-gray-900 text-sm rounded-md
                        block w-full p-2.5 dark:bg-gray-700
                        dark:border-gray-600 dark:placeholder-gray-400 
                        dark:text-white outline-none 
                        focus:border-orange-400 dark:focus:border-orange-400
                        duration-100 ease-linear" value="2024-9-22" />
                </div>

                <FormSelect
                    label=" نوع الطلب"
                    name="gender"
                    options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                    ]}
                />

                <div className='flex justify-end items-end '>
                    <button

                        className="  bg-themeColor-600 text-white w-full text-center px-4 py-2 rounded-md hover:bg-themeColor-700 transition duration-200 ">
                        عرض
                    </button>
                </div>

            </div>


            <Table
                data={tableData}
                headers={tableHeaders}
                openCreate={() => setModalType('project')}
                openPreview={openPreview}
                addItemLabel="Project"
                onDelete={() => console.log('Delete function not implemented')}
            />
            {modalType === 'preview' && (
                <PreviewProjects closeModal={() => setModalType(null)} projectIdId={selectedProjectId} />
            )}
            {modalType === "project" && (
                <AddDepartures
                    closeModal={() => setModalType(null)}
                    modal={modalType === "project"}
                    onClientAdded={addNewProjectToTable}
                />
            )}
        </div>
    );
};

export default ProjectTable;
