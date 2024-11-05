import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AddDepartures from './AddDepartures';
import PreviewProjects from './PreviewProjects';
import Table from '../../components/Table';
import { FaPlus } from "react-icons/fa";
import FormSelect from '../../components/form/FormSelect';

const DeparturesTable = ({ openPreview, openCreate, refreshData }) => {
    const [modalType, setModalType] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [branches, setBranches] = useState([]);
    const [entities, setEntities] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedEntity, setSelectedEntity] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            // Construct filter parameters based on selected values
            const params = {};
            if (selectedBranch) params.branch = selectedBranch;
            if (selectedEntity) params.entity = selectedEntity;
            if (selectedEmployee) params.employee = selectedEmployee;
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            // Fetch departures data with or without filters
            const departuresResponse = await axios.get('https://bio.skyrsys.com/api/activity/departures/', {
                headers: { 'Authorization': `Token ${token}` },
                params, // Pass filters if they exist
            });

            const departures = departuresResponse.data;
            const formattedDepartures = departures.map(departure => {
                const departureDate = new Date(departure.timestamp);
                const formattedDate = `${String(departureDate.getDate()).padStart(2, '0')}/${String(departureDate.getMonth() + 1).padStart(2, '0')}/${departureDate.getFullYear()}`;
                return {
                    firstName: departure.employee.first_name || 'Unknown First Name',
                    lastName: departure.employee.last_name || 'Unknown Last Name',
                    email: departure.employee.email || 'Unknown Email',
                    entity: departure.employee.entity.ar_name || 'Unknown Entity',
                    branch: departure.employee.branch || 'Unknown Branch',
                    departureDate: formattedDate || 'Unknown Date',
                };
            });

            setTableData(formattedDepartures);
            setTableHeaders([
                { key: 'firstName', label: 'الاسم الاول' },
                { key: 'lastName', label: 'الاسم الاخير' },
                { key: 'email', label: 'البريد الالكتروني' },
                { key: 'entity', label: 'الجهة' },
                { key: 'branch', label: 'الفرع' },
                { key: 'departureDate', label: 'تاريخ المغادره' },
            ]);
        } catch (error) {
            console.error('Error fetching data:', error.response?.data || error.message);
        }
    }, [selectedBranch, selectedEntity, selectedEmployee, startDate, endDate]);

    // Function to trigger data fetching with filters
    const handleFilterClick = () => {
        fetchData();
    };


    const fetchFormData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            const [branchesResponse, entitiesResponse, employeesResponse] = await Promise.all([
                axios.get('https://bio.skyrsys.com/api/branch/branches/', { headers: { 'Authorization': `Token ${token}` } }),
                axios.get('https://bio.skyrsys.com/api/entity/', { headers: { 'Authorization': `Token ${token}` } }),
                axios.get('https://bio.skyrsys.com/api/employee/', { headers: { 'Authorization': `Token ${token}` } }),
            ]);

            setBranches(branchesResponse.data);
            setEntities(entitiesResponse.data);
            setEmployees(employeesResponse.data);
        } catch (error) {
            console.error('Error fetching form data:', error.response?.data || error.message);
        }
    }, []);

    useEffect(() => {
        fetchData();
        fetchFormData();
    }, [fetchData, refreshData]);

    const handleOpenCreate = () => {
        console.log('Open Create button clicked');
        openCreate();
    };

    return (
        <div className="min-h-screen mt-10 font-sans lg:max-w-7xl w-full mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div className="w-full flex items-center justify-between p-4 bg-themeColor-500 border-b">
                    <h2 className="text-xl font-bold">المغادرات</h2>
                    <button
                        className="border-2 flex items-center justify-center p-2 rounded-full bg-themeColor-600 text-white hover:bg-themeColor-700 transition duration-200"
                        onClick={handleOpenCreate}
                    >
                        <FaPlus className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div className='mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                <FormSelect
                    label="الفرع"
                    options={branches.map(branch => ({ label: branch.branch_name, value: branch.id }))}
                    value={selectedBranch}
                    onChange={e => setSelectedBranch(e.target.value)}
                />
                <FormSelect
                    label="الجهه"
                    options={entities.map(entity => ({ label: entity.ar_name, value: entity.id }))}
                    value={selectedEntity}
                    onChange={e => setSelectedEntity(e.target.value)}
                />
                <FormSelect
                    label="الموظف"
                    options={employees.map(employee => ({ label: employee.first_name, value: employee.id }))}
                    value={selectedEmployee}
                    onChange={e => setSelectedEmployee(e.target.value)}
                />
                <div className='flex flex-col'>
                    <label htmlFor="startDate" className='block mb-2 text-sm font-medium text-gray-900'>تاريخ البداية</label>
                    <input
                        type="date"
                        id="startDate"
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="endDate" className='block mb-2 text-sm font-medium text-gray-900'>تاريخ الانتهاء</label>
                    <input
                        type="date"
                        id="endDate"
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleFilterClick}
                    className="bg-themeColor-400 border border-gray-300 w-full text-white px-4 py-2 rounded-md"
                >
                    عرض البيانات
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
                <AddDepartures
                    closeModal={() => setModalType(null)}
                    modal={modalType === "project"}
                    onClientAdded={() => fetchData()}
                />
            )}
        </div>
    );
};

export default DeparturesTable;
