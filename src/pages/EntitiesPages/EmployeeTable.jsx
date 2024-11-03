import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AddEntities from './AddEntities';
import { FaPlus } from "react-icons/fa";
import { DotsThreeVertical, MagnifyingGlass, Network, Plus, Trash } from '@phosphor-icons/react';
import { BiEdit } from 'react-icons/bi';
import { toast } from "react-toastify";

const EntitiesTable = ({ openCreate, refreshData }) => {
    const [tableData, setTableData] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(null);
    const [editEntityData, setEditEntityData] = useState(null); // Entity data to edit
    const menuRef = useRef(null);

    // Fetch entities data
    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) return console.error('No token found in cookies');
            const response = await axios.get('https://bio.skyrsys.com/api/entity/', {
                headers: { 'Authorization': `Token ${token}` },
            });
            setTableData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error.response?.data || error.message);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshData]);

    // Toggle menu
    const toggleMenu = (index) => {
        setIsMenuOpen(isMenuOpen === index ? null : index);
    };

    // Delete entity
    const deleteEntity = async (entityId) => {
        try {
            const token = Cookies.get('token');
            await axios.delete(`https://bio.skyrsys.com/api/entity/${entityId}/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setTableData((prevData) => prevData.filter((entity) => entity.id !== entityId));
            toast.success('Entity deleted successfully');
        } catch (error) {
            toast.error('Error deleting entity');
            console.error('Error deleting entity:', error.response?.data || error.message);
        }
    };

    // Open edit form with entity data
    const openEditForm = (entity) => {
        setEditEntityData(entity);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditEntityData(null);
    };

    return (
        <div className="min-h-screen mt-10 font-sans" dir="rtl">
            <div className="lg:max-w-7xl w-full mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-themeColor-500 border-b">
                    <h2 className="text-2xl font-semibold text-white">الجهات</h2>
                    <button
                        onClick={openCreate}
                        className="border-2 flex items-center justify-center p-2 rounded-full bg-themeColor-600 text-white hover:bg-themeColor-700 transition duration-200"
                    >
                        <FaPlus size={18} />
                    </button>
                </div>

                {/* Search Bar */}
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

                {/* Table */}
                <div className="divide-y flex flex-col justify-between">
                    {tableData.map((entity, index) => (
                        <div key={index} className={`flex items-center justify-between p-4 ${index % 2 === 1 ? 'bg-blue-50' : ''}`}>
                            <div className="w-3/4 flex items-center justify-between space-x-4 space-x-reverse">
                                <div className="w-1/3 ">
                                    <span className="font-medium">{entity.ar_name}</span>
                                </div>
                                <div className="w-1/3 flex items-center gap-2">
                                    <span className="text-red-400">{entity.id}</span>
                                    <Network size={32} className="text-gray-400" />
                                </div>
                                <div className="w-1/3">
                                    <span className={`text-${entity.is_active ? 'themeColor' : 'red'}-500`}>
                                        {entity.active ? 'مفعل' : 'غير مفعل'}
                                    </span>
                                </div>
                            </div>

                            {/* Small screen menu */}
                            <div className="relative md:hidden">
                                <button
                                    onClick={() => toggleMenu(index)}
                                    className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                    <DotsThreeVertical size={24} />
                                </button>
                                {isMenuOpen === index && (
                                    <div ref={menuRef} className="absolute left-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                                        <button onClick={() => openEditForm(entity)} className="flex items-center p-2 hover:bg-gray-100 border-b w-full text-right">
                                            <BiEdit size={18} className="ml-2" /> تعديل
                                        </button>
                                        <button onClick={() => deleteEntity(entity.id)} className="flex items-center p-2 hover:bg-gray-100 border-b w-full text-right">
                                            <Trash size={18} className="ml-2" /> حذف
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Large screen actions */}
                            <div className="w-1/4 hidden md:flex space-x-2 justify-end space-x-reverse">
                                <button onClick={() => openEditForm(entity)} className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                                    <BiEdit size={18} />
                                </button>
                                <button onClick={() => deleteEntity(entity.id)} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Entity Popup */}
            {isFormOpen && (
                <AddEntities
                    closeModal={handleCloseForm}
                    onAddEntity={addNewProjectToTable}
                    entity={editEntityData} // Pass entity to edit
                />
            )}
        </div>
    );
};

export default EntitiesTable;
