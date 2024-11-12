import { FaArrowCircleDown, FaPlus } from 'react-icons/fa';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Table from '../../components/Table';
import * as XLSX from 'xlsx';
import FormSelect from '../../components/form/FormSelect';

const EntitiesTable = ({ openCreate, refreshData }) => {
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
                created: new Date(branch.created).toLocaleDateString('en-US'),
                branch_name: branch.branch_name || 'مجهول',
            }));

            setTableData(formattedData);
            setFilteredData(formattedData);
        } catch (error) {
            console.error('Error fetching branches:', error.response?.data || error.message);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshData]);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = tableData.filter(item =>
            item.branch_name.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
    };

    const handleSaveToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Branches');

        // Create a file name
        const fileName = 'branches_data.xlsx';

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, fileName);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
            <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500 border-b">
                <h2 className="text-2xl font-bold">الجهات   </h2>
                <button
                    className="flex border-2 items-center justify-center p-2 rounded-full bg-themeColor-600 text-white hover:bg-themeColor-700 transition duration-200"
                    onClick={() => openCreate()}
                >
                    <FaPlus className="h-6 w-6" />
                </button>
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

            <Table
                data={filteredData}
                headers={tableHeaders}
            />
        </div>
    );
};

export default EntitiesTable;
