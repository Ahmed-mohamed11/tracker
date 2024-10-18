import { Check, Edit, Eye, Play, Trash, X } from 'lucide-react';
import { Fragment, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IoSearch } from 'react-icons/io5';
import { FaArrowCircleDown, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Table from '../../components/Table';

const MySwal = withReactContent(Swal);

const TableActions = ({ row, deleteEmployee, openEditForm, openReviewRequest }) => {
    return (
        <div className="flex gap-2">

            <button onClick={() => openEditForm(row.id)} className="text-gray-500">
                <Edit size={22} />
            </button>
            <button onClick={() => deleteEmployee(row.id)} className="text-gray-500">
                <Trash size={22} />
            </button>
        </div>
    );
};

const TableUser = ({ row, openReviewRequest }) => {
    return (
        <Fragment>
            <td className="py-4">

                <div className="flex items-center bg-themeColor-200 px-2.5 py-0.5 rounded">
                    <div className={`h-2.5 w-2.5 rounded-full me-2  bg-themeColor-500`}></div>
                    مستكمل
                </div>
            </td>
            <td
                onClick={() => openReviewRequest(row)}
                className="py-4 flex w-full items-center justify-center cursor-pointer"
            >
                <img
                    className="w-10 h-10 rounded-full text-center"
                    src={row.image || './default-image.jpg'}
                    alt={`${row.first_name} image`}
                />
            </td>

            <td className="py-4">
                <Play className="mr-[30px] bg-blue-200 w-8 h-8 rounded-full p-2 text-blue-600 text-center" />
            </td>
        </Fragment>
    );
};

const EmployeeStructureTable = ({ openCreate }) => {
    const [showReviewRequest, setShowReviewRequest] = useState(false);
    const [requestData, setRequestData] = useState(null); // بيانات الطلب
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            // Change the API endpoint to fetch employees
            const response = await axios.get('https://bio.skyrsys.com/api/employee/', {
                headers: { 'Authorization': `Token ${token}` },
            });

            const employees = response.data;

            // Update headers to reflect employee data fields
            setTableHeaders([
                { key: 'first_name', label: 'الاسم الأول' },
                { key: 'last_name', label: 'الاسم الأخير' },
                { key: 'email', label: 'البريد الإلكتروني' },
                { key: 'job_number', label: 'رقم الوظيفة' },
                { key: 'job_title', label: 'عنوان الوظيفة' },
                { key: 'phone_number', label: 'رقم الهاتف' },
                { key: 'nationality', label: 'الجنسية' },
                { key: 'status', label: 'الحالة' }, // Add status if needed
            ]);

            const formattedData = employees.map(employee => ({
                first_name: employee.first_name || 'مجهول',
                last_name: employee.last_name || 'مجهول',
                email: employee.email || 'مجهول',
                job_number: employee.job_number || 'مجهول',
                job_title: employee.job_title || 'مجهول',
                phone_number: employee.phone_number || 'مجهول',
                nationality: employee.nationality || 'مجهول',
                image: employee.image || './default-image.jpg',
                id: employee.id,
                voices: employee.voices || [],
                status: employee.status || 'غير محدد', // Adjust according to the response
            }));

            setTableData(formattedData);
            setFilteredData(formattedData);

        } catch (error) {
            console.error('Error fetching employee data:', error.response?.data || error.message);
        }
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = tableData.filter(item =>
            item.first_name.toLowerCase().includes(query) ||
            item.last_name.toLowerCase().includes(query) ||
            item.phone_number.includes(query)
        );
        setFilteredData(filtered);
    };

    const openReviewRequest = async (row) => {
        try {
            setRequestData(row);
            setShowReviewRequest(true);
        } catch (error) {
            console.error('Error fetching request details:', error);
        }
    };


    const deleteEmployee = async (id) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.delete(`https://bio.skyrsys.com/api/registration-requests/${id}/`, {
                headers: { 'Authorization': `Token ${token}` },
            });

            if (response.status === 204) {
                const newTableData = tableData.filter(item => item.id !== id);
                setTableData(newTableData);
                setFilteredData(newTableData);
            }
        } catch (error) {
            console.error('Error deleting employee:', error.response?.data || error.message);
        }
    };


    const [editData, setEditData] = useState(null);

    const openEditForm = (row) => {
        setEditData(row);
    };

    // const closeEditForm = () => {
    //     setEditData(null);
    // };



    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
            <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500  border-b">
                <h2 className="text-2xl font-bold"> الموظفين المسجلين</h2>

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
                    <div className="relative flex items-center justify-center">
                        <select className="bg-gray-200 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200">
                            <option value="">حالة الطلب</option>
                            <option value="pending">قيد الانتظار</option>
                            <option value="approved">موافقة</option>
                            <option value="rejected">مرفوض</option>
                        </select>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <select className="bg-gray-200 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200">
                            <option value="">حالة الطلب</option>
                            <option value="pending">قيد الانتظار</option>
                            <option value="approved">موافقة</option>
                            <option value="rejected">مرفوض</option>
                        </select>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <select className="bg-gray-200 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200">
                            <option value="">حالة الطلب</option>
                            <option value="pending">قيد الانتظار</option>
                            <option value="approved">موافقة</option>
                            <option value="rejected">مرفوض</option>
                        </select>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <select className="bg-gray-200 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200">
                            <option value="">حالة الطلب</option>
                            <option value="pending">قيد الانتظار</option>
                            <option value="approved">موافقة</option>
                            <option value="rejected">مرفوض</option>
                        </select>
                    </div>

                    <button
                        onClick={() => console.log('Export function')}
                        className="w-1/3 bg-themeColor-500 text-white text-center hover:bg-themeColor-600 px-4 py-2 rounded-md transition duration-200 flex justify-center items-center"
                    >
                        تصدير
                        <FaArrowCircleDown size={20} className="mr-2" />
                    </button>
                </div>
            </div>
            {/* Table */}
            <Table
                data={filteredData}
                headers={tableHeaders}
                userImage={(row) => <TableUser row={row} openReviewRequest={openReviewRequest} />}
                actions={(row) => (
                    <TableActions
                        row={row}
                        deleteEmployee={deleteEmployee}
                        openEditForm={openEditForm}
                        openReviewRequest={openReviewRequest}
                    />
                )}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default EmployeeStructureTable;
