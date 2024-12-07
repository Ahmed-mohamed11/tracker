import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaArrowCircleDown } from 'react-icons/fa';
import Table from '../../components/Table';
import * as XLSX from 'xlsx';
import FormSelect from '../../components/form/FormSelect';

const DailyMovementsTable = ({ openCreate }) => {
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // New state for filters
    const [branches, setBranches] = useState([]);
    const [entities, setEntities] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedEntity, setSelectedEntity] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedActivity, setSelectedActivity] = useState('Attendance'); // Default to 'Attendance'

    // Function to save data to Excel
    const handleSaveToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Activities');
        XLSX.writeFile(workbook, 'activities_data.xlsx');
    };

    // Fetch main data
    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get('https://bio.skyrsys.com/api/activity/activities/', {
                headers: { 'Authorization': `Token ${token}` },
            });
            const registrationRequests = response.data;
            setTableHeaders([
                { key: 'employee', label: 'اسم الموظف' },
                { key: 'branch', label: 'اسم الفرع' },
                { key: 'entity', label: 'اسم الجهة' },
            ]);
            const formattedData = registrationRequests.map(request => ({
                employee: request.employee ? `${request.employee.first_name} ${request.employee.last_name}` : 'مجهول',
                branch: request.branch || 'مجهول',
                entity: request.entity?.ar_name || 'مجهول',
            }));
            setTableData(formattedData);
            setFilteredData(formattedData);
        } catch (error) {
            console.error('Error fetching registration requests:', error.response?.data || error.message);
        }
    }, []);

    // Fetch branches, entities, and employees
    const fetchFiltersData = async () => {
        const token = Cookies.get('token');
        try {
            const [branchRes, entityRes, employeeRes] = await Promise.all([
                axios.get('https://bio.skyrsys.com/api/branch/branches/', { headers: { 'Authorization': `Token ${token}` } }),
                axios.get('https://bio.skyrsys.com/api/entity/', { headers: { 'Authorization': `Token ${token}` } }),
                axios.get('https://bio.skyrsys.com/api/employee/', { headers: { 'Authorization': `Token ${token}` } }),
            ]);

            setBranches(branchRes.data.map(branch => ({ value: branch.id, label: branch.branch_name })));
            setEntities(entityRes.data.map(entity => ({ value: entity.id, label: entity.ar_name })));
            setEmployees(employeeRes.data.map(employee => ({
                value: employee.id,
                label: `${employee.first_name} ${employee.last_name}`,
            })));
        } catch (error) {
            console.error('Error fetching filter data:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchData();
        fetchFiltersData();
    }, [fetchData]);

    const handleFilter = async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get('https://bio.skyrsys.com/api/activity/activities/', {
                headers: { 'Authorization': `Token ${token}` },
                params: {
                    employee: selectedEmployee,
                    branch: selectedBranch,
                    entity: selectedEntity,
                    activity_type: selectedActivity, // Use selectedActivity for filter
                    start_date: startDate,
                    end_date: endDate,
                },
            });

            const filteredRequests = response.data.map(request => ({
                employee: request.employee ? `${request.employee.first_name} ${request.employee.last_name}` : 'مجهول',
                branch: request.branch || 'مجهول',
                entity: request.entity?.ar_name || 'مجهول',
            }));

            setFilteredData(filteredRequests);
        } catch (error) {
            console.error('Error filtering data:', error.response?.data || error.message);
        }
    };

    return (
        <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
            <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500 border-b">
                <h2 className="text-2xl font-bold">حركات الموظف اليوميه</h2>
            </div>

            <div className='items-end grid grid-cols-1 mb-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                <FormSelect label="الفرع" options={branches} onChange={(e) => setSelectedBranch(e.target.value)} />
                <FormSelect label="الجهه" options={entities} onChange={(e) => setSelectedEntity(e.target.value)} />
                <FormSelect label="الموظف" options={employees} onChange={(e) => setSelectedEmployee(e.target.value)} />
                <FormSelect
                    label="نوع الحركه"
                    options={[
                        { value: 'Attendance', label: 'حضور' },
                        { value: 'Departure', label: 'انصراف' },
                    ]}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                />

                <button onClick={handleFilter} className="bg-themeColor-400 text-white px-4 py-2 rounded-md">عرض البيانات</button>
            </div>

            <Table data={filteredData} headers={tableHeaders} currentPage={currentPage} totalPages={Math.ceil(filteredData.length / itemsPerPage)} setCurrentPage={setCurrentPage} />
        </div>
    );
};

export default DailyMovementsTable;
