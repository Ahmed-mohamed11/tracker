import { useState } from 'react';
import { X } from '@phosphor-icons/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const EditEntity = ({ entity, closeModal, onUpdate }) => {
    const [formData, setFormData] = useState({
        ar_name: entity.ar_name || '',
        en_name: entity.en_name || '',
        active: entity.active ?? true,
        branch: entity.branch || '',
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? e.target.checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            await axios.put(`https://bio.skyrsys.com/api/entity/${entity.id}/`, formData, {
                headers: { 'Authorization': `Token ${token}` }
            });
            toast.success('تم تعديل الجهة بنجاح');
            onUpdate(); // Trigger update in the table after editing
            closeModal();
        } catch (error) {
            toast.error('خطأ في تعديل الجهة');
            console.error('Error updating entity:', error.response?.data || error.message);
        }
    };

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && closeModal()}
            className="fixed top-0 left-0 z-50 w-full h-full backdrop-blur-sm"
        >
            <div
                className="absolute top-0 left-0 w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 overflow-auto h-screen transition-transform duration-500 ease-in-out"
                dir="rtl"
            >
                <div className="relative p-4 sm:p-5">
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b dark:border-gray-600 shadow-md shadow-gray-300/10">
                        <h2 className="text-xl text-gray-900 font-semibold">تعديل جهة</h2>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <X size={18} weight="bold" />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700">الاسم بالعربية</label>
                            <input
                                type="text"
                                name="ar_name"
                                value={formData.ar_name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                minLength={1}
                                maxLength={100}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">الاسم بالإنجليزية</label>
                            <input
                                type="text"
                                name="en_name"
                                value={formData.en_name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                minLength={1}
                                maxLength={100}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">الحالة</label>
                            <select
                                name="active"
                                value={formData.active}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value={true}>مفعل</option>
                                <option value={false}>غير مفعل</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">الفرع</label>
                            <input
                                type="number"
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                            حفظ التعديلات
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEntity;
