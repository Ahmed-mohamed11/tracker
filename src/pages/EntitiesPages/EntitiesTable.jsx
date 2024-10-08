import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AddEntities from './AddEntities'; // استيراد مكون AddEntities
import { FaPlus } from "react-icons/fa"; // أيقونة إضافة
import { DotsThreeVertical, MagnifyingGlass, Network, Plus, Trash } from '@phosphor-icons/react';
import { BiEdit } from 'react-icons/bi';

const EntitiesTable = ({ openCreate }) => {
    const [tableData, setTableData] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false); // حالة إدارة إظهار الفورم
    const [isMenuOpen, setIsMenuOpen] = useState(null); // لتتبع الزر الذي تم النقر عليه لفتح القائمة
    const menuRef = useRef(null);

    // جلب بيانات الجهات من الـ API
    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const entitiesResponse = await axios.get('https://bio.skyrsys.com/api/entity/', {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            const entities = entitiesResponse.data;
            setTableData(entities); // تخزين البيانات المستلمة في حالة الجدول
        } catch (error) {
            console.error('Error fetching data:', error.response?.data || error.message);
        }
    }, []);

    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        // إضافة مستمع للنقر خارج القائمة
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const addNewProjectToTable = (newEntity) => {
        setTableData((prevData) => [...prevData, newEntity]); // إضافة كيان جديد إلى الجدول
    };

    const toggleMenu = (index) => {
        setIsMenuOpen(isMenuOpen === index ? null : index); // تغيير حالة القائمة لفتحها أو إغلاقها حسب الزر الذي تم النقر عليه
    };

    return (
        <div className="min-h-screen mt-5 font-sans" dir="rtl">
            <div className="lg:max-w-7xl w-full mx-auto">
                <div className="flex items-center justify-between p-4 bg-green-100 border-b">
                    <h2 className="text-2xl font-semibold text-green-500">الجهات</h2>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={openCreate} // استدعاء الدالة عند الضغط
                            className="flex items-center justify-center p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition duration-200"
                        >
                            <FaPlus size={18} />
                        </button>
                    </div>
                </div>

                <div className="w-full flex items-center justify-between p-4 border-b">
                    <div className="w-2/3 my-5 relative">
                        <input
                            type="text"
                            placeholder="بحث"
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="divide-y flex flex-col justify-between">
                    {tableData.map((entity, index) => (
                        <div key={index} className={`flex items-center justify-between p-4 ${index % 2 === 1 ? 'bg-blue-50' : ''}`}>
                            <div className="w-2/3 flex items-center justify-between space-x-4 space-x-reverse">
                                <div className="w-1/3 ">
                                    <span className="font-medium">{entity.name}</span> {/* عرض اسم الجهة */}
                                </div>
                                <div className="w-1/3 flex items-center gap-2">
                                    <span className="text-red-400">{entity.id}</span> {/* عرض معرف الجهة */}
                                    <Network size={32} className="text-gray-400" />
                                </div>
                                <div className="w-1/3">
                                    <span className={`text-${entity.is_active ? 'green' : 'red'}-500`}>
                                        {entity.is_active ? 'مفعل' : 'غير مفعل'}
                                    </span> {/* حالة الجهة */}
                                </div>
                            </div>

                            {/* أيقونة القائمة للشاشات الصغيرة */}
                            <div className="relative md:hidden">
                                <button
                                    onClick={() => toggleMenu(index)}
                                    className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                    <DotsThreeVertical size={24} />
                                </button>
                                {isMenuOpen === index && (
                                    <div
                                        ref={menuRef}
                                        className="absolute left-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10"
                                    >
                                        <button className="flex items-center p-2 hover:bg-gray-100 border-b w-full text-right">
                                            <BiEdit size={18} className="ml-2" />
                                            تعديل
                                        </button>
                                        <button className="flex items-center p-2 hover:bg-gray-100 border-b w-full text-right">
                                            <Trash size={18} className="ml-2" />
                                            حذف
                                        </button>
                                        <button className="flex items-center p-2 hover:bg-gray-100 w-full text-right">
                                            <Plus size={18} className="ml-2" />
                                            إضافة
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* الأزرار للشاشات الكبيرة */}
                            <div className="hidden md:flex space-x-2 justify-end space-x-reverse">
                                <button className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                                    <BiEdit size={18} />
                                </button>
                                <button className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                                    <Trash size={18} />
                                </button>
                                <button className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* عرض مكون AddEntities عند فتح الفورم */}
            {isFormOpen && (
                <AddEntities closeModal={handleCloseForm} onClientAdded={addNewProjectToTable} />
            )}
        </div>
    );
};

export default EntitiesTable;
