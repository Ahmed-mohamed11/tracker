import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AddProjects from './AddProjects'; // Ensure the path is correct
import PreviewProjects from './PreviewProjects';
import Table from '../../components/Table';
import { IoSearch } from "react-icons/io5";
import { FaFilter } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { FaArrowCircleDown, FaPlus } from "react-icons/fa";

const ProjectTable = ({ openPreview, openCreate }) => {
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
        <div className="min-h-screen   p-8">
            <div className="flex justify-between items-center mt-6">
                <div className="flex space-x-4">
                    <div className="relative">
                        <input type="text" placeholder="Search..." className="bg-gray-800 text-white px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <IoSearch className="absolute right-3 top-2.5 text-gray-400" size={20} />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">Search</button>
                    <select className="bg-gray-800 w-full text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200">
                        <option value="">حاله الطلب</option>
                        <option value="pending">pending</option>
                        <option value="approved">approved</option>
                        <option value="rejected">rejected</option>
                    </select>

                    <select className="bg-gray-800 w-full text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200">
                        <option value="">حاله الطلب</option>
                        <option value="pending">pending</option>
                        <option value="approved">approved</option>
                        <option value="rejected">rejected</option>
                    </select>


                    <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200 flex items-center">
                        <FaArrowCircleDown size={20} className="mr-2" />
                        Export
                    </button>
                </div>
                <button
                    onClick={handleOpenCreate}

                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center">
                    <FaPlus size={20} className="mr-2" />
                    Add new task
                </button>
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
                <AddProjects
                    closeModal={() => setModalType(null)}
                    modal={modalType === "project"}
                    onClientAdded={addNewProjectToTable}
                />
            )}
        </div>
    );
};

export default ProjectTable;