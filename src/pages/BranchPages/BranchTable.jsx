import { Check, Eye, PackagePlus, Play, Replace, X } from 'lucide-react';
import { Fragment, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IoSearch } from 'react-icons/io5';
import { FaArrowCircleDown, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Table from '../../components/Table';
// import ReviewRequest from './ReviewRequest';
// import ChangePlan from './ChangePlan';

const MySwal = withReactContent(Swal);



const BranchTable = ({ openCreate }) => {
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

            const response = await axios.get('https://bio.skyrsys.com/api/branch/branches/', {
                headers: { 'Authorization': `Token ${token}` },
            });

            const branches = response.data;

            setTableHeaders([

                { key: 'branch_name', label: 'اسم الفرع' },
                { key: 'created', label: 'تاريخ الإنشاء' },
            ]);

            const formattedData = branches.map(branch => ({
                created: new Date(branch.created).toLocaleDateString('en-US'), // Format date in English
                branch_name: branch.branch_name || 'مجهول',
            }));

            setTableData(formattedData);
            setFilteredData(formattedData);
        } catch (error) {
            console.error('Error fetching branches:', error.response?.data || error.message);
        }
    }, []);

    const [showChangePlan, setShowChangePlan] = useState(false);
    const changePlan = (row) => {
        setRequestData(row);
        setShowChangePlan(true);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = tableData.filter(item =>
            item.company.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
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
        a.download = 'branches.csv';
        document.body.appendChild(a);
        a.click();
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
            <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500 border-b">
                <h2 className="text-2xl font-bold">الفروع   </h2>
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
                            placeholder="ابحث عن اسم الشركه"
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

            />
            {/*
            {showChangePlan && <ChangePlan requestData={requestData} onClose={() => setShowChangePlan(false)} />}
            {showReviewRequest && <ReviewRequest requestData={requestData} onClose={() => setShowReviewRequest(false)} />}
*/}
        </div>
    );
};

export default BranchTable;
