import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaArrowCircleDown } from 'react-icons/fa';
import Table from '../../components/Table';
import * as XLSX from 'xlsx';
import FormSelect from '../../components/form/FormSelect';


const ReportsTable = ({ openCreate }) => {
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const handleSaveToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Activities');
        XLSX.writeFile(workbook, 'activities_data.xlsx');
    };

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }




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
                branch: request.branch ? request.branch : 'مجهول',
                entity: request.entity?.ar_name ? request.entity.ar_name : 'مجهول',
            }));

            setTableData(formattedData);
            setFilteredData(formattedData);
        } catch (error) {
            console.error('Error fetching registration requests:', error.response?.data || error.message);
        }
    }, []);



    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = tableData.filter(item =>
            item.employee.toLowerCase().includes(query) ||
            item.branch.toLowerCase().includes(query) ||
            item.entity.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
    };

    return (
        <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
            <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500  border-b">
                <h2 className="text-2xl font-bold">حركات الإنصراف</h2>
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
                            { label: 'الموظف 1', value: '1' },
                            { label: 'الموظف 2', value: '2' },
                            { label: 'الموظف 3', value: '3' },
                        ]}
                    />
                </div>

                <div className='flex flex-col'>
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear' htmlFor="start_date">تاريخ البداية</label>
                    <input
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200 "
                        type="date" id="start_date" name="start_date" />
                </div>

                <div className='flex flex-col'>
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear' htmlFor="end_date">تاريخ الانتهاء</label>
                    <input
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200 "
                        type="date" id="end_date" name="end_date" />
                </div>

                <div>
                    <button className="bg-themeColor-400 border border-gray-300 w-full text-white px-4 py-2 rounded-md transition duration-200">عرض البيانات</button>
                </div>

                <div>
                    <button
                        onClick={handleSaveToExcel}
                        className="w-1/3 bg-themeColor-500 text-white text-center hover:bg-themeColor-700 px-4 py-2 rounded-md transition duration-200 flex justify-center items-center"
                    >
                        تصدير
                        <FaArrowCircleDown size={20} className="mr-2" />
                    </button>
                </div>
            </div>

            <Table
                data={filteredData}
                headers={tableHeaders}
                currentPage={currentPage}
                totalPages={Math.ceil(filteredData.length / itemsPerPage)}
                setCurrentPage={setCurrentPage}
            />

        </div>
    );
};

export default ReportsTable;
