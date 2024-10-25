import { useEffect, useState } from "react";
import { Trash, X, UserPlus, ChevronDownIcon, ChevronRightIcon, CheckCheckIcon, ChevronDown, ChevronRight, } from "lucide-react";
import axios from 'axios'; // استيراد مكتبة Axios
import Cookies from 'js-cookie';
import FormSelect from "../../../components/form/FormSelect";

function AddEmployeeForm({ handleClose, handleAddEmployee }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState([]);
    const [branchesList, setBranchesList] = useState([]);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error state

    const toggleDropdown = () => setIsOpen(!isOpen);

    const toggleGroup = (groupName) => {
        setExpandedGroups((prev) =>
            prev.includes(groupName)
                ? prev.filter((name) => name !== groupName)
                : [...prev, groupName]
        );
    };

    const handleItemClick = (itemId, groupName) => {
        setSelectedItems((prev) => {
            if (itemId === 'تحديد الكل') {
                const group = options.find((g) => g.name === groupName);
                const allSelected = group.items.every((i) => prev.includes(i.id));
                return allSelected
                    ? prev.filter((i) => !group.items.map(item => item.id).includes(i))
                    : [...new Set([...prev, ...group.items.map(item => item.id)])];
            } else {
                return prev.includes(itemId)
                    ? prev.filter((i) => i !== itemId)
                    : [...prev, itemId];
            }
        });
    };

    const isGroupSelected = (groupName) => {
        const group = options.find((g) => g.name === groupName);
        return group.items.every((item) => selectedItems.includes(item.id));
    };

    const isAllSelected = () => {
        const allItems = options.flatMap((group) => group.items.map(item => item.id));
        return allItems.every((item) => selectedItems.includes(item));
    };

    const handleSelectAll = () => {
        if (isAllSelected()) {
            setSelectedItems([]);
        } else {
            const allItems = options.flatMap((group) => group.items.map(item => item.id));
            setSelectedItems(allItems);
        }
    };

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

            // إضافة سجل للتحقق من هيكل البيانات
            console.log("Fetched branches data:", response.data);

            const transformedOptions = response.data.map(branch => ({
                name: branch.branch_name,
                items: branch.entities.map(entity => ({
                    id: entity.id,
                    ar_name: entity.ar_name
                }))
            }));

            setOptions(transformedOptions);
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    };



    useEffect(() => {
        fetchBranches();
    }, []);

    const handleSave = () => {
        console.log("branchesList:", branchesList);
        console.log("selectedItems:", selectedItems);

        const selectedEmployees = selectedItems.map(itemId =>
            branchesList.flatMap(branch => branch.entities)
                .find(entity => entity.id === itemId)
        ).filter(Boolean); // تأكد من تصفية القيم الصحيحة

        console.log("selectedEmployees:", selectedEmployees);

        const employeeIds = selectedEmployees.map(emp => emp.id);

        if (employeeIds.length > 0) {
            handleAddEmployee(employeeIds);
            console.log("Employee IDs:", employeeIds);
            handleClose();
        } else {
            console.log("No employee IDs found."); // سجل إذا لم يتم العثور على أي IDs
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
                {loading && <p>جارٍ التحميل...</p>} {/* Loading indicator */}
                {error && <p className="text-red-500">{error}</p>} {/* Error message */}
                <div className="w-80 font-sans">
                    <div className="relative mb-4">
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center justify-between w-full px-4 py-2 text-right bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        >
                            <span className="text-gray-700 font-medium">
                                {selectedItems.length > 0
                                    ? `تم اختيار ${selectedItems.length} عنصر`
                                    : 'اختر العناصر'}
                            </span>
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        </button>
                        {isOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                                <div className="max-h-60 overflow-y-auto">
                                    <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors duration-150">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected()}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="mr-3 text-sm font-medium text-gray-700">تحديد الكل</span>
                                    </label>
                                    {options.map((group) => (
                                        <div key={group.name} className="border-b border-gray-200 last:border-b-0">
                                            <div
                                                className="flex items-center justify-between px-4 py-2 bg-gray-50 cursor-pointer transition-colors duration-150"
                                                onClick={() => toggleGroup(group.name)}
                                            >
                                                <span className="text-sm font-medium text-gray-700">{group.name}</span>
                                                <ChevronRight
                                                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedGroups.includes(group.name) ? 'transform rotate-90' : ''
                                                        }`}
                                                />
                                            </div>
                                            {expandedGroups.includes(group.name) && (
                                                <div className="pr-4 pb-2">
                                                    <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150">
                                                        <input
                                                            type="checkbox"
                                                            checked={isGroupSelected(group.name)}
                                                            onChange={() => handleItemClick('تحديد الكل', group.name)}
                                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <span className="mr-3 text-sm font-medium text-gray-700">تحديد الكل</span>
                                                    </label>
                                                    {group.items.map((item) => (
                                                        <label key={item.id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedItems.includes(item.id)}
                                                                onChange={() => handleItemClick(item.id, group.name)}
                                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                            />
                                                            <span className="mr-3 text-sm font-medium text-gray-700">{item.ar_name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleSave}
                        className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        حفظ
                    </button>
                </div>
            </div>
        </div>
    );
}






export default function ShiftForm({ handleSave, handleCancel, selectedDate }) {
    const [title, setTitle] = useState("");
    const [checkInTime, setCheckInTime] = useState("17:20");
    const [maxCheckInTime, setMaxCheckInTime] = useState("");
    const [shiftEndTime, setShiftEndTime] = useState("");
    const [repeat, setRepeat] = useState("");
    const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
    const [employees, setEmployees] = useState([]);

    const handleAddEmployee = (newEmployees) => {
        setEmployees((prevEmployees) => [
            ...prevEmployees,
            ...newEmployees // Merge the existing employees with the newly added ones
        ]);
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
            employees_ids: employees.map(employee => employee.id) // Populate employees_ids with selected employee IDs
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

