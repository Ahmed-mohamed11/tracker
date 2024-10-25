import { useEffect, useState } from "react";
import { Trash, X, UserPlus, ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import axios from 'axios'; // استيراد مكتبة Axios
import Cookies from 'js-cookie';
import FormSelect from "../../../components/form/FormSelect";



function AddEmployeeForm({ handleClose, handleAddEmployee }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState([]);
    const [branchesList, setBranchesList] = useState([]);

    const fetchBranches = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('لم يتم العثور على الرمز في الكوكيز');
                return;
            }

            const response = await axios.get('https://bio.skyrsys.com/api/working-hours/branchs-list/', {
                headers: { 'Authorization': `Token ${token}` },
            });

            setBranchesList(response.data);
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const handleItemClick = (item, groupId) => {
        setSelectedItems(prev => {
            const groupEntities = branchesList.find(branch => branch.id === groupId).entities;
            if (item === 'Select all') {
                const allSelected = groupEntities.every(groupItem => prev.some(i => i.id === groupItem.id));
                return allSelected
                    ? prev.filter(i => !groupEntities.some(gi => gi.id === i.id))
                    : [...new Set([...prev, ...groupEntities])];
            } else {
                return prev.some(i => i.id === item.id)
                    ? prev.filter(i => i.id !== item.id)
                    : [...prev, item];
            }
        });
    };

    const isGroupSelected = (groupId) => {
        const groupEntities = branchesList.find(branch => branch.id === groupId).entities;
        return groupEntities.every(item => selectedItems.some(i => i.id === item.id));
    };

    const handleSave = () => {
        // معالجة البيانات المختارة وحفظها
        const selectedBranch = selectedItems.find(item => branchesList.some(branch => branch.entities.some(e => e.id === item.id)));

        if (selectedBranch) {
            handleAddEmployee({
                employee: selectedBranch.id, // افتراضًا أن المختار هو الفرع
                entity: selectedBranch.id   // إذا كنت تريد التعامل مع الكيانات يمكن تعديل هذه الجزئية
            });
            handleClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-2xl relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-semibold mb-6 text-center">أضف موظف</h2>
                <div className="mb-4 space-y-4">
                    <div className="mb-10 relative w-full font-sans">
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center justify-between w-full px-4 py-2 text-right bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <span className="text-gray-700">اختر الفرع والكيانات</span>
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                        </button>
                        {isOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                {branchesList.map((branch) => (
                                    <div key={branch.id} className="border-b border-gray-200 last:border-b-0">
                                        <button
                                            onClick={() => toggleGroup(branch.id)}
                                            className="flex items-center justify-between w-full px-4 py-2 text-right hover:bg-gray-100"
                                        >
                                            <span className="text-sm font-medium text-gray-700">{branch.branch_name}</span>
                                            <ChevronRightIcon className={`w-4 h-4 text-gray-400 transition-transform ${expandedGroups.includes(branch.id) ? 'transform rotate-90' : ''}`} />
                                        </button>
                                        {expandedGroups.includes(branch.id) && (
                                            <div className="pr-4 pb-2">
                                                <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={isGroupSelected(branch.id)}
                                                        onChange={() => handleItemClick('Select all', branch.id)}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="mr-3 text-sm font-medium text-gray-700">تحديد الكل</span>
                                                </label>
                                                {branch.entities.map((entity) => (
                                                    <label key={entity.id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.some(i => i.id === entity.id)}
                                                            onChange={() => handleItemClick(entity, branch.id)}
                                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <span className="mr-3 text-sm font-medium text-gray-700">{entity.ar_name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between mt-20">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none"
                        >
                            إلغاء
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-6 py-2 bg-themeColor-600 text-white rounded-md hover:bg-themeColor-700 focus:outline-none"
                        >
                            حفظ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ShiftForm({ handleSave, handleCancel, selectedDate }) {
    const [title, setTitle] = useState("");
    const [checkInTime, setCheckInTime] = useState("17:20"); // تعيين وقت تسجيل الدخول الافتراضي هنا
    const [maxCheckInTime, setMaxCheckInTime] = useState("");
    const [shiftEndTime, setShiftEndTime] = useState("");
    const [repeat, setRepeat] = useState("");
    const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
    const [employees, setEmployees] = useState([]);

    const handleAddEmployee = (employee) => {
        setEmployees([...employees, employee]);
    };

    const handleRemoveEmployee = (index) => {
        setEmployees(employees.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const checkInDate = new Date(`1970-01-01T${checkInTime}:00`);
        const maxCheckInDate = new Date(`1970-01-01T${maxCheckInTime}:00`);
        const flexibleMinutes = Math.max(0, (maxCheckInDate - checkInDate) / (1000 * 60)); // حساب الفارق بالدقائق

        // تنسيق التاريخ بشكل صحيح إلى YYYY-MM-DD
        const formattedDate = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : null;

        const payload = {
            date: formattedDate,
            start_hour: checkInTime,
            end_hour: shiftEndTime,
            flexible_minutes: flexibleMinutes, // استخدام القيمة المحسوبة هنا
            is_vacation: false,
            employees_ids: []
        };

        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('لم يتم العثور على الرمز في الكوكيز');
                return;
            }

            const response = await axios.post('https://bio.skyrsys.com/api/working-hours/', payload, {
                headers: {
                    'Authorization': `Token ${token}`,
                }
            });
            console.log('Data sent successfully:', response.data);
            handleSave(payload);
            handleCancel();

        } catch (error) {
            console.error('Error sending data:', error);
            // يمكنك إضافة رسالة خطأ للمستخدم هنا إذا رغبت في ذلك
        }
    };

    return (
        <>
            <div className="fixed z-50 left-0 top-[90px] h-[calc(100%-90px)] w-[40%] p-6 bg-white shadow-lg transform translate-x-0 transition-transform ease-in-out duration-300 rounded-l-lg overflow-y-auto">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
                    <h2 className="text-2xl font-semibold text-themeColor-600">
                        إضافة مناوبة
                    </h2>
                    <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-semibold">التاريخ المحدد:</h3>
                    <p>{selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'غير محدد'}</p>
                </div>

                <form className="space-y-6">
                    <div className="flex col-span-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                عنوان المناوبة
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                placeholder="أدخل عنوان المناوبة"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* وقت تسجيل الدخول للمناوبة */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                وقت تسجيل الدخول
                            </label>
                            <input
                                type="time"
                                value={checkInTime}
                                onChange={(e) => setCheckInTime(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            />
                        </div>
                        {/* أقصى وقت تسجيل الدخول */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                أقصى وقت تسجيل الدخول
                            </label>
                            <input
                                type="time"
                                value={maxCheckInTime}
                                onChange={(e) => setMaxCheckInTime(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                min={checkInTime} // تعيين الحد الأدنى لوقت تسجيل الدخول
                            />
                        </div>
                    </div>

                    {/* وقت الانصراف */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            وقت الانصراف
                        </label>
                        <input
                            type="time"
                            value={shiftEndTime}
                            onChange={(e) => setShiftEndTime(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            التكرار
                        </label>
                        <select
                            value={repeat}
                            onChange={(e) => setRepeat(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            <option value="">لا يوجد</option>
                            <option value="يومي">يومي</option>
                            <option value="أسبوعي">أسبوعي</option>
                            <option value="شهري">شهري</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowAddEmployeeForm(true)}
                        className="flex items-center px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        إضافة موظف
                    </button>

                    {/* عرض قائمة الموظفين المضافين */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">الموظفين المضافين:</h3>
                        {employees.map((employee, index) => (
                            <div key={index} className="flex items-center justify-between mb-2 p-2 border border-gray-300 rounded-md">
                                <span>{employee.employee}</span>
                                <span>{employee.entity}</span>
                                <button
                                    onClick={() => handleRemoveEmployee(index)}
                                    className="text-red-500 hover:text-red-700 focus:outline-none"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none"
                        >
                            إلغاء
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                        >
                            حفظ
                        </button>
                    </div>
                </form>
            </div>

            {showAddEmployeeForm && (
                <AddEmployeeForm
                    handleClose={() => setShowAddEmployeeForm(false)}
                    handleAddEmployee={handleAddEmployee}
                />
            )}
        </>
    );
}
