import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import RegisterEmployee from './RegisterEmployee'; // Ensure the path is correct
import PreviewProjects from './PreviewProjects';
import Table from '../../components/Table';
import { IoSearch } from "react-icons/io5";
import { FaArrowCircleDown, FaPlus } from "react-icons/fa";

const ProjectTable = ({ openPreview, openCreate }) => {
    const [modalType, setModalType] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    // Fetch data from the registration requests API
    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token'); // Retrieve token from cookies
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.get('https://bio.skyrsys.com/api/registration-requests/', {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            const registrationRequests = response.data;

            console.log('object', registrationRequests)
            setTableHeaders([
                { key: 'first_name', label: 'الاسم الأول' },
                { key: 'last_name', label: 'الاسم الأخير' },
                { key: 'email', label: 'البريد الإلكتروني' },
                { key: 'job_number', label: 'رقم الوظيفة' },
                { key: 'job_title', label: 'عنوان الوظيفة' },
                { key: 'phone_number', label: 'رقم الهاتف' },
                { key: 'nationality', label: 'الجنسية' }
            ]);

            // Format the data for the table
            const formattedData = registrationRequests.map(request => ({
                first_name: request.first_name || 'مجهول',
                last_name: request.last_name || 'مجهول',
                email: request.email || 'مجهول',
                job_number: request.job_number || 'مجهول',
                job_title: request.job_title || 'مجهول',
                phone_number: request.phone_number || 'مجهول',
                nationality: request.nationality || 'مجهول',
            }));

            setTableData(formattedData);
        } catch (error) {
            console.error('Error fetching registration requests:', error.response?.data || error.message);
        }
    }, []);

    const handleOpenCreate = () => {
        openCreate(); // Ensure this triggers the correct function
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="min-h-screen mt-10 lg:max-w-7xl w-full mx-auto">
            <div className="mb-10 w-full flex items-center justify-between p-4 bg-green-100 border-b ">
                <h2 className="text-2xl font-bold">طلبات تسجيل الموظفين</h2>
                <button
                    className="flex items-center justify-center p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition duration-200"
                    onClick={handleOpenCreate}
                >
                    <FaPlus className="h-6 w-6 " />
                </button>
            </div>
            <div className="flex justify-between items-center mt-6 gap-14">
                <div className="flex w-4/5 gap-5">
                    <div className="relative flex items-center justify-center">
                        <input type="text" placeholder="بحث" className="bg-gray-200 text-gray-900 px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <div className='h-full absolute px-2 right-0 top-0 rounded-r-md border-gray-600 text-gray-400 flex items-center justify-center'>
                            <IoSearch size={20} />
                        </div>
                    </div>
                    <select className="bg-gray-200 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200">
                        <option value="">حالة الطلب</option>
                        <option value="pending">قيد الانتظار</option>
                        <option value="approved">موافقة</option>
                        <option value="rejected">مرفوض</option>
                    </select>
                    <button className="bg-green-500 text-white text-center hover:bg-green-600 px-4 py-2 rounded-md transition duration-200 flex items-center">
                        تصدير
                        <FaArrowCircleDown size={20} className="mr-2" />
                    </button>
                </div>
            </div>

            <Table
                data={tableData}
                headers={tableHeaders}
                openCreate={() => setModalType('project')}
                openPreview={openPreview}
                addItemLabel="إضافة مشروع"
                onDelete={() => console.log('Delete function not implemented')}
            />
            {modalType === 'preview' && (
                <PreviewProjects closeModal={() => setModalType(null)} projectId={selectedProjectId} />
            )}
            {modalType === "project" && (
                <RegisterEmployee
                    closeModal={() => setModalType(null)}
                    modal={modalType === "project"}
                />
            )}
        </div>
    );
};

export default ProjectTable;
