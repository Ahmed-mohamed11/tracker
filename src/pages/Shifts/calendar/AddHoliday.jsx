import { useState } from 'react';
import { X, Plus, Calendar } from 'lucide-react';

export function AddHolidayForm({ handleClose, handleSave }) {
    const [holidayTitle, setHolidayTitle] = useState('');
    const [holidayDate, setHolidayDate] = useState('');
    const [holidayPeriod, setHolidayPeriod] = useState(1);
    const [holidayPlan, setHolidayPlan] = useState('');
    const [holidayRepeat, setHolidayRepeat] = useState('');

    const handleIncrement = () => setHolidayPeriod(holidayPeriod + 1);
    const handleDecrement = () => {
        if (holidayPeriod > 1) setHolidayPeriod(holidayPeriod - 1);
    };

    const handleSubmit = () => {
        if (holidayTitle && holidayDate && holidayPlan) {
            handleSave({
                title: holidayTitle,
                date: holidayDate,
                period: holidayPeriod,
                plan: holidayPlan,
                repeat: holidayRepeat,
            });
            handleClose();
        }
    };

    return (

        <div className="transform transition-all duration-3000">
            {/* إضافة عنوان */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    إضافة عنوان
                </label>
                <input
                    type="text"
                    value={holidayTitle}
                    onChange={(e) => setHolidayTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="إضافة عنوان"
                />
            </div>

            {/* تاريخ العطلة */}
            <div className='my-5'>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاريخ العطلة
                </label>
                <div className="relative">
                    <input
                        type="date"
                        value={holidayDate}
                        onChange={(e) => setHolidayDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                </div>
            </div>

            {/* مدة العطلة */}
            <div className="flex items-center">
                <button
                    type="button"
                    onClick={handleDecrement}
                    className="w-10 h-10 px-3  py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                >
                    -
                </button>
                <span className="mx-4 text-lg">{holidayPeriod} يوم</span>
                <button
                    type="button"
                    onClick={handleIncrement}
                    className="w-10 h-10  px-3 py-2 flex items-center justify-center bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* اختر الخطة */}
            <div className="my-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    اختر الخطة
                </label>
                <select
                    value={holidayPlan}
                    onChange={(e) => setHolidayPlan(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                    <option value="" disabled>اختر الخطة</option>
                    <option value="خطة 1">خطة 1</option>
                    <option value="خطة 2">خطة 2</option>
                    <option value="خطة 3">خطة 3</option>
                </select>
            </div>

            {/* تكرار العطلة */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    اختر التكرار
                </label>
                <select
                    value={holidayRepeat}
                    onChange={(e) => setHolidayRepeat(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                    <option value="">بدون تكرار</option>
                    <option value="يومي">يومي</option>
                    <option value="أسبوعي">أسبوعي</option>
                    <option value="شهري">شهري</option>
                </select>
            </div>

            {/* الأزرار */}
            <div className="flex justify-between mt-8">
                <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none"
                >
                    إلغاء
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                >
                    حفظ
                </button>
            </div>
        </div>

    );
}
