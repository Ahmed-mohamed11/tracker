import { Check, Eye, Play, Trash, X } from 'lucide-react';
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
        <div className="flex gap-2">
            <button onClick={() => openReviewRequest(row.id)} className="text-blue-500">
                <Eye size={22} />
            </button>
            <button onClick={() => refuseRequest(row.id)} className="text-gray-500">
                <X size={22} />
            </button>
            <button onClick={() => approveRequest(row.id)} className="text-gray-500">
                <Check size={22} />
            </button>
        </div>
    );
};

const TableUser = ({ row, openReviewRequest }) => {
    return (
        <Fragment>
            <td className="py-4">
                <div className="flex items-center bg-themeColor-200 px-2.5 py-0.5 rounded">
                    <div className="h-2.5 w-2.5 rounded-full bg-themeColor-200 me-2"></div>
                    {row.status || 'مستكمل'}
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

const CompaniesTable = ({ openCreate }) => {

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

            const response = await axios.get('https://bio.skyrsys.com/api/registration-requests/', {
                headers: { 'Authorization': `Token ${token}` },
            });

            const registrationRequests = response.data;

            setTableHeaders([
                { key: 'first_name', label: 'الاسم الأول' },
                { key: 'last_name', label: 'الاسم الأخير' },
                { key: 'email', label: 'البريد الإلكتروني' },
                { key: 'job_number', label: 'رقم الوظيفة' },
                { key: 'job_title', label: 'عنوان الوظيفة' },
                { key: 'phone_number', label: 'رقم الهاتف' },
                { key: 'nationality', label: 'الجنسية' }
            ]);

            const formattedData = registrationRequests.map(request => ({
                first_name: request.first_name || 'مجهول',
                last_name: request.last_name || 'مجهول',
                entity: request.entity || 'مجهول',
                email: request.email || 'مجهول',
                job_number: request.job_number || 'مجهول',
                job_title: request.job_title || 'مجهول',
                phone_number: request.phone_number || 'مجهول',
                nationality: request.nationality || 'مجهول',
                image: request.image || './default-image.jpg',
                id: request.id,
                voices: request.voices || []
            }));

            setTableData(formattedData);
            setFilteredData(formattedData);

        } catch (error) {
            console.error('Error fetching registration requests:', error.response?.data || error.message);
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

    const approveRequest = async (id) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.post(`https://bio.skyrsys.com/api/registration-requests/${id}/approve/`, {}, {
                headers: { 'Authorization': `Token ${token}` },
            });

            MySwal.fire({
                icon: 'success',
                title: 'تمت الموافقة على الطلب بنجاح',
                text: response.data.message || 'تمت الموافقة على الطلب.',
            });

            fetchData(); // إعادة تحميل البيانات بعد الموافقة

        } catch (error) {
            console.error('Error approving the request:', error.response?.data || error.message);
            MySwal.fire({
                icon: 'error',
                title: 'خطأ',
                text: error.response?.data?.detail || 'فشل في الموافقة على الطلب.',
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
        a.download = 'employees.csv';
        document.body.appendChild(a);
        a.click();
    }



    const refuseRequest = async (id) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.post(`https://bio.skyrsys.com/api/registration-requests/${id}/refuse/`, {}, {
                headers: { 'Authorization': `Token ${token}` },
            });

            MySwal.fire({
                icon: 'success',
                title: 'تمت الموافقة على الطلب بنجاح',
                text: response.data.message || 'تمت الموافقة على الطلب.',
            });

            fetchData(); // إعادة تحميل البيانات بعد الموافقة

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
    }, [fetchData]);

    return (
        <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
            <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500  border-b">
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
                        onClick={() => exportTableToExcel()}
                        className="w-1/2  bg-themeColor-500 text-white text-center hover:bg-themeColor-700 px-4 py-2 rounded-md transition duration-200 flex justify-center items-center"
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
                userImage={(row) => (
                    <TableUser row={row} openReviewRequest={openReviewRequest} />
                )}
                actions={(row) => (
                    <TableActions
                        openPreview={() => console.log('Preview function')}
                        row={row}
                        approveRequest={approveRequest}
                        refuseRequest={refuseRequest}
                        openReviewRequest={openReviewRequest}
                    />
                )}
                currentPage={currentPage}
                totalPages={Math.ceil(filteredData.length / itemsPerPage)}
                setCurrentPage={setCurrentPage}
            />

            {showReviewRequest && (
                <ReviewRequest
                    className=""
                    requestData={requestData} // تمرير بيانات الطلب إلى ReviewRequest
                    onClose={() => setShowReviewRequest(false)}
                />
            )}
        </div>

    );

};

export default CompaniesTable;