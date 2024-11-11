import { useEffect, useState } from "react";
import { Trash, UserPlus, X } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import AddEmployeeForm from "../../EmployeePages/AddEmployee";
import { toast } from "react-toastify";

export default function ShiftForm({ handleCancel, selectedDate, selectedData, onAddShift, selectedEntities }) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [checkInTime, setCheckInTime] = useState("17:20");
    const [maxCheckInTime, setMaxCheckInTime] = useState("");
    const [shiftEndTime, setShiftEndTime] = useState("");
    const [repeat, setRepeat] = useState("يومي");  // Default to daily
    const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (selectedData) {
            setDate(selectedDate ? new Date(selectedDate) : null);
            setTitle(selectedData.title || '');
            setCheckInTime(selectedData.start_hour || '');
            setShiftEndTime(selectedData.end_hour || '');
            setIsChecked(selectedData.is_vacation || false);
            setEmployees(selectedData.entities || []);
        }
    }, [selectedData]);

    const handleToggle = () => {
        setIsChecked(!isChecked);
        if (!isChecked) {
            setTitle("");
            setCheckInTime("");
            setShiftEndTime("");
            setMaxCheckInTime("");
            setEmployees([]);
        }
    };

    const handleAddEmployee = (newEmployees) => {
        setEmployees((prevEmployees) => [...prevEmployees, ...newEmployees]);
    };

    const handleRemoveEmployee = (index) => {
        setEmployees(employees.filter((_, i) => i !== index));
    };
    console.log('4', selectedData)


    const handleSubmit = async () => {
        const token = Cookies.get("token");
        if (!token) {
            console.error("Token not found in cookies");
            return;
        }

        const entitiesIds = employees.map((employee) => employee.id);
        const formattedDate = selectedDate
            ? new Date(selectedDate).toLocaleDateString("en-CA")
            : null;

        const payloadBase = {
            title,
            is_vacation: isChecked,
            entities_ids: entitiesIds,
            ...(isChecked ? {} : {  // Include only if not a vacation day
                start_hour: checkInTime || "00:00", // قيمة افتراضية إذا كان الحقل فارغًا
                end_hour: shiftEndTime || "00:00",   // قيمة افتراضية إذا كان الحقل فارغًا
                flexible_minutes: maxCheckInTime
                    ? Math.max(0, (new Date(`1970-01-01T${maxCheckInTime}:00`) - new Date(`1970-01-01T${checkInTime}:00`)) / (1000 * 60))
                    : 0,
            }),
            date: formattedDate,
        };

        try {
            const endpoint =
                repeat === "أسبوعي"
                    ? "https://bio.skyrsys.com/api/working-hours/add-weekly/"
                    : "https://bio.skyrsys.com/api/working-hours/";

            // إرسال الطلب للرابط الأسبوعي مباشرةً إذا كانت التكرارية "أسبوعي"
            const response = await axios.post(endpoint, payloadBase, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            onAddShift(response.data);
            toast.success("تمت إضافة المناوبة بنجاح");
            handleCancel();
        } catch (error) {
            toast.error("حدث خطأ أثناء إضافة المناوبة");
            console.error("Error sending data:", error);
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
                    <h3 className="text-lg font-semibold">
                        التاريخ المحدد:{" "}
                        {selectedDate
                            ? new Date(selectedDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            })
                            : "غير محدد"}
                    </h3>
                </div>

                <form className="space-y-6">
                    <div className="flex justify-between grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="w-1/2">
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
                                نوع اليوم{" "}
                            </label>
                            <div className="flex items-center justify-start border-2 border-gray-300 p-2 rounded-md">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isChecked}
                                        onChange={handleToggle}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        {isChecked ? "يوم عطله" : "يوم مناوبه"}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {!isChecked && (
                        <>
                            <div className="grid grid-cols-2 gap-6">
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        أقصى وقت تسجيل الدخول
                                    </label>
                                    <input
                                        type="time"
                                        value={maxCheckInTime}
                                        onChange={(e) => setMaxCheckInTime(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        min={checkInTime}
                                    />
                                </div>
                            </div>

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
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            التكرار
                        </label>
                        <select
                            value={repeat}
                            onChange={(e) => setRepeat(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            <option value="يومي">اليوم</option>
                            <option value="أسبوعي">أسبوعي</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowAddEmployeeForm(true)}
                        className="flex items-center px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none"
                    >
                        <UserPlus className="w-4 h-4 mx-2" />
                        إضافة جهة
                    </button>

                    <div>
                        <h3 className="mt-4 mb-2 font-semibold text-gray-700">
                            الجهات الحالية
                        </h3>
                        {employees.length === 0 && <p> لم يتم إضافة جهة بعد.</p>}
                        <ul>
                            {employees.map((employee, index) => (
                                <li key={employee.id} className="flex items-center justify-between p-2 border-b border-gray-300">
                                    <span>{employee.id || "الرقم غير متوفر"}</span>
                                    <span>{employee.ar_name || "اسم غير متوفر"}</span>
                                    <button onClick={() => handleRemoveEmployee(index)}>
                                        <Trash className="w-4 h-4 text-red-600 hover:text-red-800" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                        >
                            حفظ المناوبة
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>

                {showAddEmployeeForm && (
                    <AddEmployeeForm
                        handleAddEmployee={handleAddEmployee}
                        handleClose={() => setShowAddEmployeeForm(false)}
                    />
                )}

            </div>
        </>
    );
}