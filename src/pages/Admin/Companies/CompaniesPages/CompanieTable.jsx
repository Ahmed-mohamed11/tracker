import { Check, Eye, PackagePlus, Play, Replace, X } from 'lucide-react';
import { Fragment, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IoSearch } from 'react-icons/io5';
import { FaArrowCircleDown, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Table from '../../../../components/Table';
import ReviewRequest from './ReviewRequest';
import ChangePlan from './ChangePlan';
import * as XLSX from 'xlsx';

const MySwal = withReactContent(Swal);

const TableActions = ({ changePlan, row, approveRequest }) => (
    <div className="w-full flex gap-4">
        <button
            onClick={() => changePlan(row)}
            className="bg-primary-400 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm"
        >
            تغير الخطة
        </button>
        <button
            onClick={() => approveRequest(row.id)}
            className="bg-themeColor-400 hover:bg-themeColor-600 text-white px-4 py-2 rounded-md text-sm"
        >
            تجديد الاشتراك
        </button>
    </div>
);

const CompaniesTable = ({ openCreate, refreshData }) => {
    const [showReviewRequest, setShowReviewRequest] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showChangePlan, setShowChangePlan] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.get('https://bio.skyrsys.com/api/superadmin/companies/', {
                headers: { 'Authorization': `Token ${token}` },
            });

            const companies = response.data;
            setTableHeaders([
                { key: 'company_name', label: 'اسم الشركة' },
                { key: 'company_code', label: 'كود الشركة' },
                { key: 'email', label: 'البريد الإلكتروني' },
                { key: 'end_date', label: 'تاريخ انتهاء' },
                { key: 'current_plan', label: 'الخطة الحالية' },
                { key: 'status', label: 'المده المتبقيه' },
            ]);

            const formattedData = companies.map(company => {
                const endDate = new Date(company.end_date);
                const today = new Date();
                const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

                return {
                    company_name: company.company_name || 'مجهول',
                    company_code: company.company_code || 'مجهول',
                    email: company.email || 'مجهول',
                    end_date: company.end_date || 'مجهول',
                    current_plan: company.current_plan || 'مجهول',
                    status: (
                        <span className={`px-3 py-1 rounded text-white ${remainingDays <= 0 ? 'bg-red-500' : remainingDays <= 7 ? 'bg-yellow-500' : 'bg-green-400'}`}>
                            {remainingDays <= 0 ? 'منتهي' : `${remainingDays} يوم`}
                        </span>
                    ),
                    company_logo: company.company_logo || './default-image.jpg',
                    id: company.id,
                };
            });

            setTableData(formattedData);
            setFilteredData(formattedData);
        } catch (error) {
            console.error('Error fetching companies:', error.response?.data || error.message);
        }
    }, []);

    const handleSaveToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Branches');
        XLSX.writeFile(workbook, 'companies_data.xlsx');
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = tableData.filter(item =>
            item.company_name.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
    };

    const changePlan = (row) => {
        setRequestData(row);
        setShowChangePlan(true);
    };

    const approveRequest = async (id) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const result = await MySwal.fire({
                title: 'هل تريد تجديد الاشتراك؟',
                text: "لن تتمكن من التراجع عن هذا!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'نعم, جدد الاشتراك!',
                cancelButtonText: 'إلغاء'
            });

            if (result.isConfirmed) {
                await axios.post('https://bio.skyrsys.com/api/superadmin/renew-subscription/', { company_id: id }, {
                    headers: { 'Authorization': `Token ${token}` }
                });

                MySwal.fire({
                    icon: 'success',
                    title: 'تمت تجديد الطلب بنجاح',
                });
                fetchData(); // Reload data after approval
            }
        } catch (error) {
            console.error('Error approving the request:', error.response?.data || error.message);
            MySwal.fire({
                icon: 'error',
                title: 'خطأ',
                text: error.response?.data?.detail || 'فشل في الموافقة على الطلب.',
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshData]); // Add refreshData as a dependency


    return (
        <div className="min-h-screen mt-10 lg:max-w-7xl px-4 w-full mx-auto">
            <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500 border-b">
                <h2 className="text-2xl font-bold">الشركات</h2>
                <button
                    className="flex border-2 items-center justify-center p-2 rounded-full bg-themeColor-600 text-white hover:bg-themeColor-700 transition duration-200"
                    onClick={openCreate}
                >
                    <FaPlus className="h-6 w-6" />
                </button>
            </div>

            <div className="flex justify-between items-center mb-6 gap-14">
                <div className="flex w-full gap-4">
                    <div className="w-2/3 relative flex items-center justify-center">
                        <input
                            type="text"
                            placeholder="ابحث عن اسم الشركه"
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
                        className="w-1/3 bg-themeColor-500 text-white text-center hover:bg-themeColor-700 px-4 py-2 rounded-md transition duration-200 flex justify-center items-center"
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
                        row={row}
                        approveRequest={approveRequest}
                        changePlan={changePlan}
                    />
                )}
                currentPage={currentPage}
                totalPages={Math.ceil(filteredData.length / itemsPerPage)}
                setCurrentPage={setCurrentPage}
            />

            {showChangePlan && (
                <ChangePlan
                    showChangePlan={showChangePlan}
                    setShowChangePlan={setShowChangePlan}
                    requestData={requestData}
                    fetchData={fetchData}
                    closeModal={() => setShowChangePlan(false)}
                />
            )}
        </div>
    );
};

export default CompaniesTable;
