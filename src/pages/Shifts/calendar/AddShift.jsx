import { useState } from 'react'
import { UserPlus, X, Trash } from 'lucide-react'

import { AddHolidayForm } from "./AddHoliday"

function AddEmployeeForm({ handleClose, handleAddEmployee }) {
    const [selectedDepartment, setSelectedDepartment] = useState("")
    const [selectedEmployee, setSelectedEmployee] = useState("")

    const handleSave = () => {
        if (selectedDepartment && selectedEmployee) {
            handleAddEmployee({ department: selectedDepartment, employee: selectedEmployee })
            handleClose()
        }
    }

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
                <div className="space-y-4">
                    {/* اختيار الجهة */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            اختر الجهة
                        </label>
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            <option value="" disabled>اختر الجهة</option>
                            <option value="جهة 1">جهة 1</option>
                            <option value="جهة 2">جهة 2</option>
                            <option value="جهة 3">جهة 3</option>
                        </select>
                    </div>

                    {/* اختيار الموظف */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            اختر الموظف
                        </label>
                        <select
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            <option value="" disabled>اختر الموظف</option>
                            <option value="موظف 1">موظف 1</option>
                            <option value="موظف 2">موظف 2</option>
                            <option value="موظف 3">موظف 3</option>
                        </select>
                    </div>

                    {/* الأزرار */}
                    <div className="flex justify-between mt-6">
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
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                        >
                            حفظ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default function ShiftForm({ handleSave, handleCancel }) {
    const [title, setTitle] = useState("")
    const [checkInTime, setCheckInTime] = useState("")
    const [maxCheckInTime, setMaxCheckInTime] = useState("")
    const [shiftStartTime, setShiftStartTime] = useState("")
    const [shiftEndTime, setShiftEndTime] = useState("")
    const [repeat, setRepeat] = useState("")
    const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false)
    const [showAddHoliday, setShowAddHoliday] = useState(false)
    const [employees, setEmployees] = useState([])


    const handleAddEmployee = (employee) => {
        setEmployees([...employees, employee])
    }

    const handleRemoveEmployee = (index) => {
        setEmployees(employees.filter((_, i) => i !== index))
    }

    const handleSubmit = () => {
        handleSave({
            title,
            checkInTime,
            maxCheckInTime,
            shiftStartTime,
            shiftEndTime,
            repeat,
            employees,
        })
        handleCancel()
    }

    return (
        <>
            <div className="fixed z-50 left-0 top-[90px] h-[calc(100%-90px)] w-[40%] p-6 bg-white shadow-lg transform translate-x-0 transition-transform ease-in-out duration-300 rounded-l-lg overflow-y-auto">
                {/* عنوان النموذج */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
                    <h2 className="text-2xl font-semibold text-green-600">
                        {showAddHoliday ? "اضافة عطله" : "اضافة مناوبة"}
                    </h2>
                    <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex justify-between mb-6">
                    <button
                        onClick={() => setShowAddHoliday(false)}
                        className={`px-24 py-2 border-spacing-2 border-b-4 border-gray-300 rounded-md text-gray-700 ${showAddHoliday ? "bg-gray-50 " : "bg-green-300 rounded-md"}`}
                    >
                        مناوبة
                    </button>
                    <button
                        onClick={() => setShowAddHoliday(true)}
                        className={`px-24  py-2 border-spacing-2 border-b-4 border-gray-300 rounded-md text-gray-700 ${showAddHoliday ? "bg-green-300" : "bg-gray-50 rounded-md"}`}
                    >
                        عطله
                    </button>
                </nav>


                {showAddHoliday ? (
                    <AddHolidayForm
                        
                        handleSave={handleAddEmployee}
                        handleCancel={() => setShowAddHoliday(false)}
                    />
                ) :
                    <form className="space-y-6">
                        {/* عنوان المناوبة */}
                        <div className="col-span-2">
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

                        {/* الحقول في صفوف مقسمة */}
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

                            {/* الحد الأقصى لتسجيل الدخول */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    الحد الأقصى لتسجيل الدخول
                                </label>
                                <input
                                    type="time"
                                    value={maxCheckInTime}
                                    onChange={(e) => setMaxCheckInTime(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            {/* وقت بداية المناوبة */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    وقت بداية المناوبة
                                </label>
                                <input
                                    type="time"
                                    value={shiftStartTime}
                                    onChange={(e) => setShiftStartTime(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            {/* وقت نهاية المناوبة */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    وقت نهاية المناوبة
                                </label>
                                <input
                                    type="time"
                                    value={shiftEndTime}
                                    onChange={(e) => setShiftEndTime(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            {/* تكرار المناوبة */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    تكرار المناوبة
                                </label>
                                <select
                                    value={repeat}
                                    onChange={(e) => setRepeat(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                >
                                    <option value="" disabled>اختر التكرار</option>
                                    <option value="يومي">يومي</option>
                                    <option value="أسبوعي">أسبوعي</option>
                                    <option value="شهري">شهري</option>
                                </select>
                            </div>
                        </div>

                        {/* إضافة أشخاص */}
                        <div className="flex items-center space-x-2 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowAddEmployeeForm(true)}
                                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                            >
                                <UserPlus className="w-5 h-5 mr-2" />
                                إضافة أشخاص
                            </button>
                        </div>

                        {/* جدول الموظفين المضافين */}
                        {employees.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold mb-2">الموظفين المضافين:</h3>
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border p-2">الجهة</th>
                                            <th className="border p-2">الموظف</th>
                                            <th className="border p-2">إجراء</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((employee, index) => (
                                            <tr key={index}>
                                                <td className="border p-2">{employee.department}</td>
                                                <td className="border p-2">{employee.employee}</td>
                                                <td className="border p-2 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveEmployee(index)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* الأزرار */}
                        <div className="flex justify-between mt-8">
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
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                            >
                                حفظ
                            </button>
                        </div>
                    </form>
                }
            </div >

            {showAddEmployeeForm && (
                <AddEmployeeForm
                    handleClose={() => setShowAddEmployeeForm(false)}
                    handleAddEmployee={handleAddEmployee}
                />
            )
            }
        </>
    )
}
