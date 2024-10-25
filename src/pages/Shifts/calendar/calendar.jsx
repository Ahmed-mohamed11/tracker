import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ShiftForm from './AddShift'; // تأكد من استيراد نموذج الإضافة الخاص بك
import axios from 'axios'; // تأكد من تثبيت axios
import Cookies from 'js-cookie';


const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date()); // تعيين تاريخ اليوم الحالي
    const [showForm, setShowForm] = useState(false); // حالة لعرض النموذج
    const [selectedDay, setSelectedDay] = useState(null); // يوم مختار
    const [daysData, setDaysData] = useState([]); // بيانات الأيام

    // استخدام useEffect لتعيين التاريخ الحالي عند تحميل المكون
    useEffect(() => {
        setCurrentDate(new Date()); // تعيين التاريخ الحالي
        fetchData(); // استدعاء الدالة لجلب البيانات
    }, []);

    const fetchData = async () => {

        const token = Cookies.get('token');
        if (!token) {
            console.error('No token found in cookies');
            return;
        }
        try {
            const response = await axios.get('https://bio.skyrsys.com/api/working-hours/', {
                headers: { 'Authorization': `Token ${token}` },
            });
            setDaysData(response.data); // تعيين البيانات المستردة
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
    };

    const prev = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const next = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderDays = () => {
        const days = getDaysInMonth(currentDate);
        const today = new Date().setHours(0, 0, 0, 0);

        return days.map((day) => {
            // البحث عن بيانات اليوم
            const dayData = daysData.find(d => new Date(d.date).toDateString() === day.toDateString());

            return (
                <div
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)} // استدعاء الدالة عند الضغط
                    className={`bg-white p-2 h-32 cursor-pointer ${day.getMonth() !== currentDate.getMonth() ? 'text-gray-400' : ''} ${day.setHours(0, 0, 0, 0) === today ? 'bg-green-200' : ''}`}
                >
                    <div className="flex justify-between items-center">
                        <span className="font-bold">{day.getDate()}</span>
                        {/* عرض الحالة بناءً على is_vacation */}
                        {dayData && (
                            <span className={`text-sm p-1 rounded-md font-bold ${dayData.is_vacation ? 'bg-green-500  text-white' : ' bg-themeColor-500 text-white'}`}>
                                {dayData.is_vacation ? 'يوم عطلة' : 'يوم مناوبة'}
                            </span>
                        )}
                    </div>
                    {/* عرض القيمة الناتجة */}
                    {dayData && dayData.value && (
                        <div className="text-sm text-gray-600">
                            القيمة: {dayData.value}
                        </div>
                    )}
                </div>
            );
        });
    };

    const handleDayClick = (day) => {
        setSelectedDay(day); // تعيين اليوم المختار
        setShowForm(true); // فتح النموذج
    };

    const handleOutsideClick = (e) => {
        if (e.target.id === 'overlay') {
            setShowForm(false); // إغلاق النموذج عند الضغط خارج النموذج
        }
    };

    return (
        <div className="relative">
            <div className={`max-w-7xl mx-auto mt-6 p-4`}>
                <div className="w-full mb-12 flex items-center justify-between p-4 bg-themeColor-500 border-b ">
                    <h1 className="text-2xl text-white font-bold">التقويم</h1>
                    <div className="text-white flex items-center space-x-4">
                        <button onClick={prev} className="p-2">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <span className="text-lg font-semibold">
                            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button onClick={next} className="p-2">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {daysOfWeek.map((day) => (
                        <div
                            key={day}
                            className="bg-white p-2 text-center font-medium text-indigo-600"
                        >
                            {day}
                        </div>
                    ))}
                    {renderDays()}
                </div>
            </div>

            {/* نموذج الإضافة عند الضغط على يوم */}
            {showForm && (
                <div
                    id="overlay"
                    className="fixed inset-0 flex items-start justify-end bg-black bg-opacity-50"
                    onClick={handleOutsideClick}
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <ShiftForm
                            handleSave={(data) => console.log(data)} // تنفيذ عند حفظ النموذج
                            handleCancel={() => setShowForm(false)} // إغلاق النموذج
                            selectedDate={selectedDay} // تمرير اليوم المختار
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
