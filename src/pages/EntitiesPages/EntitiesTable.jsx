import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AddEntities from './AddEntities'; // استيراد مكون AddEntities
import { FaPlus } from "react-icons/fa"; // أيقونة إضافة
import { DotsThreeVertical, MagnifyingGlass, Network, Plus, Trash } from '@phosphor-icons/react';
import { BiEdit } from 'react-icons/bi';
import Swal from 'sweetalert2';
import EditEntity from './EditEntity'; // Import the new edit component

const EntitiesTable = ({ openCreate, refreshData }) => {
    const [tableData, setTableData] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false); // حالة إدارة إظهار الفورم
    const [isMenuOpen, setIsMenuOpen] = useState(null); // لتتبع الزر الذي تم النقر عليه لفتح القائمة
    const [selectedEntity, setSelectedEntity] = useState(null); // للحفظ كيان المختار للتعديل
    const menuRef = useRef(null);

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
            setTableData(entitiesResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error.response?.data || error.message);
        }
    }, []);

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedEntity(null);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: "لن تتمكن من استعادة هذا العنصر!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'نعم، احذفها!'
        }).then((result) => {
            if (result.isConfirmed) {
                const token = Cookies.get('token');
                axios.delete(`https://bio.skyrsys.com/api/entity/${id}/`, {
                    headers: { 'Authorization': `Token ${token}` }
                }).then(() => {
                    setTableData(tableData.filter(entity => entity.id !== id));
                    Swal.fire('تم الحذف!', 'تم حذف العنصر بنجاح.', 'success');
                }).catch(error => {
                    console.error('Error deleting entity:', error);
                    Swal.fire('خطأ', 'لم يتم الحذف، حاول مرة أخرى.', 'error');
                });
            }
        });
    };

    const toggleMenu = (index) => {
        setIsMenuOpen(isMenuOpen === index ? null : index);
    };

    const openEditPopup = (entity) => {
        setSelectedEntity(entity);
        setIsFormOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshData]);

    useEffect(() => {
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

    return (
        <div className="min-h-screen mt-10 font-sans" dir="rtl">
            <div className="lg:max-w-7xl w-full mx-auto">
                <div className="flex items-center justify-between p-4 bg-themeColor-500 border-b">
                    <h2 className="text-2xl font-semibold text-white">الجهات</h2>
                    <button
                        onClick={openCreate}
                        className="border-2 flex items-center justify-center p-2 rounded-full bg-themeColor-600 text-white hover:bg-themeColor-700 transition duration-200"
                    >
                        <FaPlus size={18} />
                    </button>
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
                            <div className="w-3/4 flex items-center justify-between space-x-4 space-x-reverse">
                                <span className="font-medium w-1/3">{entity.ar_name}</span>
                                <span className="text-red-400 w-1/3">{entity.id}</span>
                                <span className={`text-${entity.is_active ? 'themeColor' : 'red'}-500 w-1/3`}>
                                    {entity.active ? 'مفعل' : 'غير مفعل'}
                                </span>
                            </div>

                            <div className="relative md:hidden">
                                <button
                                    onClick={() => toggleMenu(index)}
                                    className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                    <DotsThreeVertical size={24} />
                                </button>
                                {isMenuOpen === index && (
                                    <div ref={menuRef} className="absolute left-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                                        <button onClick={() => openEditPopup(entity)} className="flex items-center p-2 hover:bg-gray-100 border-b w-full text-right">
                                            <BiEdit size={18} className="ml-2" />
                                            تعديل
                                        </button>
                                        <button onClick={() => handleDelete(entity.id)} className="flex items-center p-2 hover:bg-gray-100 w-full text-right">
                                            <Trash size={18} className="ml-2" />
                                            حذف
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="w-1/4 hidden md:flex space-x-2 justify-end space-x-reverse">
                                <button onClick={() => openEditPopup(entity)} className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                                    <BiEdit size={18} />
                                </button>
                                <button onClick={() => handleDelete(entity.id)} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isFormOpen && (
                <EditEntity entity={selectedEntity} closeModal={handleCloseForm} onUpdate={fetchData} />
            )}
        </div>
    );
};

export default EntitiesTable;
