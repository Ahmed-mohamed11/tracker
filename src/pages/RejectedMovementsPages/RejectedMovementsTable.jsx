import { Check, Edit, Eye, Play, Trash, X } from 'lucide-react';
import { Fragment, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IoSearch } from 'react-icons/io5';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Table from '../../components/Table';

const MySwal = withReactContent(Swal);

const TableActions = ({ row, deleteRequest }) => {
    return (
        <div className="flex gap-2">
            <button onClick={() => deleteRequest(row.id)} className="text-gray-500">
                <Trash size={22} />
            </button>
        </div>
    );
};

const RefusedTable = ({ openCreate }) => {
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Fetch data from API
    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            // API endpoint to fetch refused registration requests
            const response = await axios.get('https://bio.skyrsys.com/api/registration-requests/refused/', {
                headers: { 'Authorization': `Token ${token}` },
            });

            const requests = response.data;

            // Set table headers
            setTableHeaders([
                { key: 'first_name', label: 'الاسم الأول' },
                { key: 'last_name', label: 'الاسم الأخير' },
                { key: 'email', label: 'البريد الإلكتروني' },
                { key: 'entity_name', label: 'اسم الجهه' },
                { key: 'job_number', label: 'رقم الوظيفة' },
                { key: 'job_title', label: 'عنوان الوظيفة' },
                { key: 'phone_number', label: 'رقم الهاتف' },
                { key: 'nationality', label: 'الجنسية' },
            ]);

            // Format data to match table structure
            const formattedData = requests.map(request => ({
                first_name: request.first_name || 'مجهول',
                last_name: request.last_name || 'مجهول',
                email: request.email || 'مجهول',
                entity_name: request.entity_name || 'مجهول',
                job_number: request.job_number || 'مجهول',
                job_title: request.job_title || 'مجهول',
                phone_number: request.phone_number || 'مجهول',
                status: request.status || 'مجهول',
                nationality: request.nationality || 'مجهول',
                image: request.image || '',
                id: request.id,
            }));

            setTableData(formattedData);
            setFilteredData(formattedData);
        } catch (error) {
            console.error('Error fetching registration requests:', error.response?.data || error.message);
        }
    }, []);

    // Handle search functionality
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = tableData.filter(item =>
            item.first_name.toLowerCase().includes(query) ||
            item.last_name.toLowerCase().includes(query) ||
            item.phone_number.includes(query) ||
            item.status.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
    };

    // Delete request function
    const deleteRequest = async (id) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.delete(`https://bio.skyrsys.com/api/registration-requests/refused/${id}/`, {
                headers: { 'Authorization': `Token ${token}` },
            });

            if (response.status === 204) {
                const newTableData = tableData.filter(item => item.id !== id);
                setTableData(newTableData);
                setFilteredData(newTableData);
            }
        } catch (error) {
            console.error('Error deleting request:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
            <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500  border-b">
                <h2 className="text-2xl font-bold">طلبات التسجيل المرفوضة</h2>
            </div>

            <div className="mb-6 gap-14">
                <div className="grid grid-cols-4 gap-4">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="بحث"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full bg-gray-200 text-gray-900 px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-themeColor-500"
                        />
                        <div className="h-full absolute px-2 right-0 top-0 rounded-r-md border-gray-600 text-gray-400 flex items-center justify-center">
                            <IoSearch size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table component */}
            <Table
                data={filteredData}
                headers={tableHeaders}
                actions={(row) => (
                    <TableActions
                        row={row}
                        deleteRequest={deleteRequest}
                    />
                )}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default RefusedTable;
