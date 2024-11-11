import { Check, Eye, Play, Trash, X } from 'lucide-react';
import { Fragment, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IoSearch } from 'react-icons/io5';
import { FaArrowCircleDown, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Table from '../../components/Table';
import * as XLSX from 'xlsx';
import FormSelect from '../../components/form/FormSelect';

// import ReviewRequest from './Re  viewRequest';
const MySwal = withReactContent(Swal);

const TableActions = ({ row, approveRequest, refuseRequest, openReviewRequest }) => {
    return (
        <div className="flex gap-2">

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

const ReportsTable = ({ openCreate }) => {

    const [showReviewRequest, setShowReviewRequest] = useState(false);
    const [requestData, setRequestData] = useState(null); // بيانات الطلب
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
        const fileName = 'reports_data.xlsx';

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
                { key: 'entity', label: 'اسم الجهه ' },
                { key: 'phone_number', label: 'رقم الهاتف' },
                { key: 'nationality', label: 'الجنسية' }
            ]);

            const formattedData = registrationRequests.map(request => ({
                first_name: request.first_name || 'مجهول',
                last_name: request.last_name || 'مجهول',
                entity: request.entity_name || 'مجهول',
                email: request.email || 'مجهول',
                job_number: request.job_number || 'مجهول',
                job_title: request.job_title || 'مجهول',
                // entity_name: request.entity_name || 'مجهول',
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
                <h2 className="text-2xl font-bold">حركات الانصراف</h2>
             
            </div>

            <div className='items-end grid grid-cols-1 mb-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                <div>
                    <FormSelect
                        label="الفرع"
                        options={[
                            { label: 'الفرع 1', value: '1' },
                            { label: 'الفرع 2', value: '2' },
                            { label: 'الفرع 3', value: '3' },
                        ]}
                    />
                </div>
                <div>
                    <FormSelect
                        label="الجهه"
                        options={[
                            { label: 'الجهه 1', value: '1' },
                            { label: 'الجهه 2', value: '2' },
                            { label: 'الجهه 3', value: '3' },
                        ]}
                    />
                </div>
                <div>
                    <FormSelect
                        label="الموظف"
                        options={[
                            { label: 'الجهه 1', value: '1' },
                            { label: 'الجهه 2', value: '2' },
                            { label: 'الجهه 3', value: '3' },
                        ]}
                    />
                </div>


                <div className='flex flex-col'>
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear' htmlFor="date">تاريخ البداية</label>
                    <input
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200 "
                        type="date" id="date" name="date" />
                </div>


                <div className='flex flex-col'>
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear' htmlFor="date">تاريخ الانتهاء</label>
                    <input
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200 "
                        type="date" id="date" name="date" />
                </div>

                <div>
                    <button
                        className="bg-themeColor-400 border border-gray-300 w-full text-white px-4 py-2 rounded-md transition duration-200 "
                    >عرض البيانات </button>
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

export default ReportsTable;
