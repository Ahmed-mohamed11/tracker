import {  FaPlus } from 'react-icons/fa';
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
   
    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.get('https://bio.skyrsys.com/api/entity/', {
                headers: { 'Authorization': `Token ${token}` },
            });

            const entities = response.data;

             setTableHeaders([
                { key: 'ar_name', label: 'اسم الجهة (Ar)' },
                { key: 'en_name', label: 'اسم الجهة (En)' },
                { key: 'active', label: 'Active' },
                { key: 'branch', label: 'Branch' },
                { key: 'created', label: 'تاريخ الإنشاء' },
            ]);

            // Format the data to include the new fields
            const formattedData = entities.map(entity => ({
                ar_name: entity.ar_name || 'مجهول',
                en_name: entity.en_name || 'Unknown',
                active: entity.active ? 'Yes' : 'No',
                branch: entity.branch || 'N/A',
                created: new Date(entity.created).toLocaleDateString('en-US'),
            }));

            setTableData(formattedData);
            setFilteredData(formattedData);
        } catch (error) {
            console.error('Error fetching entity:', error.response?.data || error.message);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshData]);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = tableData.filter(item =>
            item.ar_name.toLowerCase().includes(query) ||
            item.en_name.toLowerCase().includes(query) ||
            item.branch.toString().toLowerCase().includes(query)
        );
        setFilteredData(filtered);
    };

    const handleSaveToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Entities');

        const fileName = 'entities_data.xlsx';
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
            <div className="mb-10 w-full flex items-center justify-between p-4 bg-themeColor-500 border-b">
                <h2 className="text-2xl font-bold">الجهات</h2>
                <button
                    className="flex border-2 items-center justify-center p-2 rounded-full bg-themeColor-600 text-white hover:bg-themeColor-700 transition duration-200"
                    onClick={openCreate}
                >
                    <FaPlus className="h-6 w-6" />
                </button>
            </div>

            <div className='items-end grid grid-cols-1 mb-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                {/* Filters */}
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

                {/* Date Filters */}
                <div className='flex flex-col'>
                    <label className='block mb-2 text-sm font-medium text-gray-900'>تاريخ البداية</label>
                    <input
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md"
                        type="date"
                    />
                </div>

                <div className='flex flex-col'>
                    <label className='block mb-2 text-sm font-medium text-gray-900'>تاريخ الانتهاء</label>
                    <input
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md"
                        type="date"
                    />
                </div>

                <div>
                    <button
                        className="bg-themeColor-400 border border-gray-300 w-full text-white px-4 py-2 rounded-md"
                    >عرض البيانات</button>
                </div>
            </div>

            <Table
                data={filteredData}
                headers={tableHeaders}
                onSearch={handleSearch}
                searchQuery={searchQuery}
            />
        </div>
    );
};

export default EntitiesTable;
