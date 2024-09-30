import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
 import AddProjects from './AddProjects'; // Ensure the path is correct
import PreviewProjects from './PreviewProjects';
import Table from '../../components/Table';

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
        <div>
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
