import { Check, Delete, Edit, Eye, PackagePlus, Play, Replace, Trash, X } from 'lucide-react';
import { Fragment, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IoSearch } from 'react-icons/io5';
import { FaArrowCircleDown, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Table from '../../../../components/Table';
import EditPlaneForm from './EditPlane';
// import ReviewRequest from './ReviewRequest';
import * as XLSX from 'xlsx';


const MySwal = withReactContent(Swal);

const TableActions = ({ row, approveRequest, refuseRequest, openReviewRequest, openEditForm }) => {
    return (
        <div className="flex justify-center items-center gap-2">
            <button onClick={() => openEditForm(row)} className="text-gray-500">
                <Edit size={22} />
            </button>
        </div>
    );
};
const PlansTable = ({ openCreate, openEdit }) => {
    const [showReviewRequest, setShowReviewRequest] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const [EditPlane, setEditPlane] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);


    const handleSaveToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Branches');

        // Create a file name
        const fileName = 'Plans_data.xlsx';

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, fileName);
    };

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.get('https://bio.skyrsys.com/api/plan/plans/', {
                headers: { 'Authorization': `Token ${token}` },
            });

            const plans = response.data;
            setTableHeaders([
                { key: 'name', label: 'اسم الخطة' },
                { key: 'price', label: 'السعر' },
                { key: 'type', label: 'النوع' },
                { key: 'max_branches', label: 'الحد الأقصى من الفروع' },
                { key: 'max_employees', label: 'الحد الأقصى من الموظفين' },
            ]);

            const formattedData = plans.map(plan => ({
                name: plan.name || 'غير محدد',
                price: plan.price || 'غير محدد',
                type: plan.type || 'غير محدد',
                max_branches: plan.max_branches || 'غير محدد',
                max_employees: plan.max_employees || 'غير محدد',
                id: plan.id,
            }));

            setTableData(formattedData);
            setFilteredData(formattedData);
        } catch (error) {
            console.error('Error fetching plans:', error.response?.data || error.message);
        }
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = tableData.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.price.toLowerCase().includes(query) ||
            item.type.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
    };

    // const openEditForm = (row) => {
    //     setEditPlane(row);
    //     setEditPlane(true);
    // };

    const openEditForm = (row) => {
        openEdit(row); // Pass the row data to openEdit in the parent component
    };

    const openReviewRequest = (row) => {
        setRequestData(row);
        setShowReviewRequest(true);
    };

    const approveRequest = async (id) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }
            MySwal.fire({
                icon: 'success',
                title: 'تمت تجديد الطلب بنجاح',
            });

            fetchData(); // Reload data after approval
        } catch (error) {
            console.error('Error approving the request:', error.response?.data || error.message);
            MySwal.fire({
                icon: 'error',
                title: 'خطأ',
                text: error.response?.data?.detail || 'فشل في الموافقة على الطلب.',
            });
        }
    };

    const refuseRequest = async (id) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            fetchData(); // Reload data after refusal
        } catch (error) {
            console.error('Error refusing the request:', error.response?.data || error.message);
            MySwal.fire({
                icon: 'error',
                title: 'خطأ',
                text: error.response?.data?.detail || 'فشل في رفض الطلب.',
            });
        }
    };


    const handleClientUpdated = (updatedPlan) => {
        // تحديث الجدول ببيانات الخطة المعدلة
        setTableData((prevData) => {
            return prevData.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan));
        });
        setFilteredData((prevData) => {
            return prevData.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan));
        });
    };


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
            <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500 border-b">
                <h2 className="text-2xl font-bold">الخطط</h2>
                <button
                    className="flex border-2 items-center justify-center p-2 rounded-full bg-themeColor-600 text-white hover:bg-themeColor-700 transition duration-200"
                    onClick={() => openCreate()}
                >
                    <FaPlus className="h-6 w-6" />
                </button>
            </div>

            <div className="flex justify-between items-center mb-6 gap-14">
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative flex items-center justify-center">
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

                    <button
                        onClick={handleSaveToExcel}
                        className="w-1/2 bg-themeColor-500 text-white text-center hover:bg-themeColor-700 px-4 py-2 rounded-md transition duration-200 flex justify-center items-center"
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
                actions={(row) => (
                    <TableActions
                        openPreview={() => console.log('Preview function')}
                        row={row}
                        openEditForm={openEditForm} approveRequest={approveRequest}
                        refuseRequest={refuseRequest}
                        openReviewRequest={openReviewRequest}
                    />
                )}
                currentPage={currentPage}
                totalPages={Math.ceil(filteredData.length / itemsPerPage)}
                setCurrentPage={setCurrentPage}
            />
            <EditPlaneForm
                // show={showEditForm}
                // onClose={() => setShowEditForm(false)}
                // plan={selectedPlan}
                handleClientUpdated={fetchData}
            />
        </div>
    );
};

export default PlansTable;
