import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ShiftForm from './AddShift';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastify';

const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showForm, setShowForm] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedData, setSelectedData] = useState({});
    const [daysData, setDaysData] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [selectedEntities, setSelectedEntities] = useState([]); // إضافة حالة جديدة لتخزين الكيانات المحددة

    const handleAddShiftEmployee = (entities) => {
        setSelectedEntities(entities); // حفظ الكيانات المحددة
        setRefreshData(prev => !prev); // تحديث البيانات
    };

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
            setDaysData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        setCurrentDate(new Date());
        fetchData();
    }, [refreshData]);

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
        const today = new Date().setHours(0, 0, 0, 0); // تعيين اليوم الحالي إلى الساعة 00:00:00

        return days.map((day) => {
            const dayData = daysData.find(d => new Date(d.date).setHours(0, 0, 0, 0) === new Date(day).setHours(0, 0, 0, 0)); // تعيين اليوم إلى الساعة 00:00:00 عند المقارنة

            return (
                <div
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)}
                    className={` p-2 h-32 cursor-pointer 
                        ${day.getMonth() !== currentDate.getMonth() ? 'text-gray-400' : ''} 
                        ${day.setHours(0, 0, 0, 0) === today ? 'bg-green-200 text-red-700' : 'bg-white'}`} // تغيير اللون اليوم الحقيقي
                >
                    <div className="flex justify-between items-center">
                        <span className="font-bold">{day.getDate()}</span>
                        {dayData && (
                            <span className={`text-sm p-1 rounded-md font-bold ${dayData.is_vacation ? 'bg-green-500 text-white' : 'bg-themeColor-500 text-white'}`}>
                                {dayData.is_vacation ? 'يوم عطلة' : 'يوم مناوبة'}
                            </span>
                        )}
                    </div>
                    {dayData && dayData.value && (
                        <div className="text-sm text-gray-600">
                            القيمة: {typeof dayData.value === 'object' ? JSON.stringify(dayData.value) : dayData.value}
                        </div>
                    )}
                </div>
            );
        });
    };


    const handleDayClick = (day) => {
        const dayData = daysData.find(d => new Date(d.date).toDateString() === day.toDateString());
        setSelectedDay(day);
        setSelectedData(dayData);
        setShowForm(true);
    };

    const handleOutsideClick = (e) => {
        if (e.target.id === 'overlay') {
            setShowForm(false);
        }
    };

    console.log(selectedData, 'selectedData');

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
                <ToastContainer />
            </div>

            {showForm && (
                <div
                    id="overlay"
                    className="fixed inset-0 flex items-start justify-end bg-black bg-opacity-50"
                    onClick={handleOutsideClick}
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <ShiftForm
                            handleSave={(data) => console.log(data)}
                            handleCancel={() => setShowForm(false)}
                            selectedDate={selectedDay}
                            selectedData={selectedData}
                            onAddShift={handleAddShiftEmployee}
                            selectedEntities={selectedEntities} // تمرير الكيانات المحددة إلى ShiftForm
                        />
                    </div>
                </div>
            )}
        </div>
    );
}