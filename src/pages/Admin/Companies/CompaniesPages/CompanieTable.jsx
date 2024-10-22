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

const MySwal = withReactContent(Swal);

const TableActions = ({ row, approveRequest, refuseRequest, openReviewRequest }) => {
    return (
        <div className="flex gap-4">
            <button onClick={() => refuseRequest(row.id)} className="text-gray-500">
                <Replace size={22} />
            </button>
            <button onClick={() => approveRequest(row.id)} className="text-gray-500">
                <PackagePlus size={22} />
            </button>
        </div>
    );
};

const CompaniesTable = ({ openCreate }) => {
    const [showReviewRequest, setShowReviewRequest] = useState(false);
    const [requestData, setRequestData] = useState(null);
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

            const response = await axios.get('https://bio.skyrsys.com/api/superadmin/companies/', {
                headers: { 'Authorization': `Token ${token}` },
            });

            const companies = response.data;

            setTableHeaders([
                { key: 'company_name', label: 'اسم الشركة' },
                { key: 'company_code', label: 'كود الشركة' },
                { key: 'email', label: 'البريد الإلكتروني' },
                { key: 'plan', label: 'الخطة' },
                { key: 'end_date', label: 'تاريخ انتهاء' },
                { key: 'current_plan', label: 'الخطة الحالية' },
                { key: 'status', label: 'الحالة' }, // New status column
            ]);

            const formattedData = companies.map(company => {
                const endDate = new Date(company.end_date);
                const today = new Date();
                const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

                return {
                    company_name: company.company_name || 'مجهول',
                    company_code: company.company_code || 'مجهول',
                    email: company.email || 'مجهول',
                    plan: company.plan || 'مجهول',
                    end_date: company.end_date || 'مجهول',
                    current_plan: company.current_plan || 'مجهول',
                    status: remainingDays <= 0 ? 'منتهي' : `${remainingDays} يوم`,  
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

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = tableData.filter(item =>
            item.company_name.toLowerCase().includes(query) ||
            item.email.toLowerCase().includes(query) ||
            item.company_code.includes(query)
        );
        setFilteredData(filtered);
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

    const exportTableToExcel = () => {
        const table = document.getElementById('table');
        const rows = table.rows;
        const csv = [];
        for (let i = 0; i < rows.length; i++) {
            const row = [];
            for (let j = 0; j < rows[i].cells.length; j++) {
                row.push(rows[i].cells[j].innerHTML);
            }
            csv.push(row.join(','));
        }
        const csvString = csv.join('\n');
        const a = document.createElement('a');
        a.href = 'data:attachment/csv,' + encodeURIComponent(csvString);
        a.target = '_blank';
        a.download = 'companies.csv';
        document.body.appendChild(a);
        a.click();
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
            <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500 border-b">
                <h2 className="text-2xl font-bold">الشركات</h2>
                <button
                    className="flex border-2 items-center justify-center p-2 rounded-full bg-themeColor-600 text-white hover:bg-themeColor-700 transition duration-200"
                    onClick={() => openCreate()}
                >
                    <FaPlus className="h-6 w-6" />
                </button>
            </div>

            <div className="flex justify-between items-center mb-6 gap-14">
                <div className="grid grid-cols-3 gap-4">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="text"
                            placeholder="بحث"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="bg-gray-200 text-gray-900 px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-themeColor-500"
                        />
                        <div className="h-full absolute px-2 right-0 top-0 rounded-r-md border-gray-600 text-gray-400 flex items-center justify-center">
                            <IoSearch size={20} />
                        </div>
                    </div>
                    <select className="bg-gray-200 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200">
                        <option value="">حالة الطلب</option>
                        <option value="pending">قيد الانتظار</option>
                        <option value="approved">موافقة</option>
                        <option value="rejected">مرفوض</option>
                    </select>
                    <button
                        onClick={exportTableToExcel}
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
                        approveRequest={approveRequest}
                        refuseRequest={refuseRequest}
                        openReviewRequest={openReviewRequest}
                    />
                )}
                renderRow={(row) => (
                    <tr key={row.id}>
                        <td>{row.company_name}</td>
                        <td>{row.company_code}</td>
                        <td>{row.email}</td>
                        <td>{row.plan}</td>
                        <td>{row.end_date}</td>
                        <td>{row.current_plan}</td>
                        <td>
                            <span  className={row.status.includes('منتهي') ? 'text-red-500' : 'text-green-500'}>
                                {row.status}
                            </span>
                        </td>
                        <td>{actions(row)}</td>
                    </tr>
                )}
                currentPage={currentPage}
                totalPages={Math.ceil(filteredData.length / itemsPerPage)}
                setCurrentPage={setCurrentPage}
            />

            {showReviewRequest && (
                <ReviewRequest
                    className=""
                    requestData={requestData} // Pass request data to ReviewRequest
                    onClose={() => setShowReviewRequest(false)}
                />
            )}
        </div>
    );
};

export default CompaniesTable;
