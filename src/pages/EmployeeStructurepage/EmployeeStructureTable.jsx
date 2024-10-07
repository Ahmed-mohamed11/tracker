import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AddEmployeeStructure from './AddEmployeeStructure'; // Ensure the path is correct
import PreviewProjects from './PreviewProjects';
import Table from '../../components/Table';
import { IoSearch } from "react-icons/io5";
import { FaArrowCircleDown, FaPlus } from "react-icons/fa";
import { useI18nContext } from '../../context/i18n-context';


const EmployeeStructureTable = ({ openPreview, openCreate }) => {
    const { t } = useI18nContext(); // Get the translation function
    const [modalType, setModalType] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token'); // Retrieve token from cookies
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            // Fetch both projects and clients
            const [projectsResponse, clientsResponse] = await Promise.all([
                axios.get('https://dashboard.cowdly.com/api/projects/', {
                    headers: {
                        'Authorization': `Token ${token}`, // Include token in the request header
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
        openCreate(); // Ensure this triggers the correct function
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
        <div className="min-h-screen p-8 lg:max-w-7xl mx-auto">

            <div className="mb-10 w-full flex items-center justify-between p-4 bg-green-100 border-b  ">
                <h2 className="text-2xl font-bold">  الموظفين</h2>
            </div>
            <div className=" flex justify-between items-center mt-6 gap-14">


                <div className="grid w-[100%] gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <div className=" relative ">
                        <input type="text" placeholder={t('registrationForm.searchPlaceholder')} className="w-full bg-gray-200 text-gray-900 px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <div className=' h-full absolute px-2 right-0 top-0 rounded-r-md border-gray-600 text-gray-400 flex items-center justify-center '>
                            <IoSearch size={20} />
                        </div>
                    </div>
                    <select className="bg-gray-200 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200">
                        <option value="">{t('registrationForm.requestStatus')}</option>
                        <option value="pending">{t('registrationForm.pending')}</option>
                        <option value="approved">{t('registrationForm.approved')}</option>
                        <option value="rejected">{t('registrationForm.rejected')}</option>
                    </select>

                    <select className="bg-gray-200 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200">
                        <option value="">{t('registrationForm.requestStatus')}</option>
                        <option value="pending">{t('registrationForm.pending')}</option>
                        <option value="approved">{t('registrationForm.approved')}</option>
                        <option value="rejected">{t('registrationForm.rejected')}</option>
                    </select>


                    <select className="bg-gray-200 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200">
                        <option value="">{t('registrationForm.requestStatus')}</option>
                        <option value="pending">{t('registrationForm.pending')}</option>
                        <option value="approved">{t('registrationForm.approved')}</option>
                        <option value="rejected">{t('registrationForm.rejected')}</option>
                    </select>

                    <select className="bg-gray-200 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200">
                        <option value="">{t('registrationForm.requestStatus')}</option>
                        <option value="pending">{t('registrationForm.pending')}</option>
                        <option value="approved">{t('registrationForm.approved')}</option>
                        <option value="rejected">{t('registrationForm.rejected')}</option>
                    </select>

                    <div className='w-[100%] flex justify-end items-end gap-5 '>
                        <button className="w-[50%]  bg-green-500 text-white text-center hover:bg-green-600 px-4 py-2 rounded-md  transition duration-200 flex items-center justify-center">
                            {t('registrationForm.export')}
                            <FaArrowCircleDown size={20} className="mr-2" />
                        </button>

                        <button

                            className="w-[50%]  bg-green-600 text-white text-center px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 ">
                            عرض
                        </button>


                    </div>

                    <div className='w-[50%] flex justify-end items-end '>

                    </div>



                </div>


            </div>

            <Table
                data={tableData}
                headers={tableHeaders}
                openCreate={() => setModalType('project')}
                openPreview={openPreview}
                addItemLabel={t('project')}
                onDelete={() => console.log('Delete function not implemented')}
            />
            {modalType === 'preview' && (
                <PreviewProjects closeModal={() => setModalType(null)} projectIdId={selectedProjectId} />
            )}
            {modalType === "project" && (
                <AddEmployeeStructure
                    closeModal={() => setModalType(null)}
                    modal={modalType === "project"}
                    onClientAdded={addNewProjectToTable}
                />
            )}
        </div>
    );
};

export default EmployeeStructureTable;
