import { useState } from "react";
import { Trash, X, UserPlus } from "lucide-react";
import axios from 'axios'; // استيراد مكتبة Axios
import Cookies from 'js-cookie';
import AddEmployeeForm from "../../EmployeePages/AddEmployee";

export default function ShiftForm({ handleSave, handleCancel, selectedDate }) {
    const [title, setTitle] = useState("");
    const [checkInTime, setCheckInTime] = useState("17:20");
    const [maxCheckInTime, setMaxCheckInTime] = useState("");
    const [shiftEndTime, setShiftEndTime] = useState("");
    const [repeat, setRepeat] = useState("");
    const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [isChecked, setIsChecked] = useState(false); // تغيير القيمة الافتراضية إلى false

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    const handleAddEmployee = (newEmployees) => {
        setEmployees((prevEmployees) => [
            ...prevEmployees,
            ...newEmployees
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

        console.log('Employees before sending:', employees);

        const payload = {
            title: title,
            date: formattedDate,
            start_hour: checkInTime,
            end_hour: shiftEndTime,
            flexible_minutes: flexibleMinutes,
            is_vacation: isChecked, // استخدام حالة isChecked لتحديد قيمة is_vacation
            entities_ids: employees
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
                    <h3 className="text-lg font-semibold">التاريخ المحدد: {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'غير محدد'}</h3>
                </div>

                <form className="space-y-6">
                    <div className=" flex justify-between  grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="w-1/2" >
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
                        <div className="w-1/2 ">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                نوع اليوم                          </label>
                            <div className="flex items-center justify-start border-2 border-gray-300 p-2 rounded-md">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value=""
                                        className="sr-only peer"
                                        checked={isChecked}
                                        onChange={handleToggle}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer   dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        {isChecked ? 'يوم عطله' : 'يوم مناوبه'}
                                    </span>
                                </label>
                            </div>
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
                            <option value="يومي">ليوم</option>
                            <option value="أسبوعي">أسبوعي</option>
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
                            <div key={index} className="flex items-center justify-between mb-2">
                                <span>{employee}</span>
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
                            className="px-4 py-2 text-white bg-gray-400 rounded-md hover:bg-gray-500 focus:outline-none"
                        >
                            إلغاء
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                        >
                            حفظ
                        </button>
                    </div>
                </form>
            </div>

            {showAddEmployeeForm && (
                <AddEmployeeForm onAddEmployee={handleAddEmployee} onClose={() => setShowAddEmployeeForm(false)} />
            )}
        </>
    );
}
