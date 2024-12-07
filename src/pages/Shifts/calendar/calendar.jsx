import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ShiftForm from "./AddShift";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";

const daysOfWeek = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];
const months = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [daysData, setDaysData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState([]);

  const handleAddShiftEmployee = (entities) => {
    setSelectedEntities(entities);
    setRefreshData((prev) => !prev);
  };

  const fetchData = async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("No token found in cookies");
      return;
    }
    try {
      const response = await axios.get(
        "https://bio.skyrsys.com/api/working-hours/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setDaysData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setCurrentDate(new Date());
    fetchData();
  }, [refreshData]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // تحديد اليوم الأول في الشهر
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
      const day = new Date(year, month, i + 1);
      // تحويل إلى توقيت UTC لتوحيد الفروقات الزمنية
      day.setHours(0, 0, 0, 0);
      return day;
    });

    // إضافة الأيام الفارغة في البداية لتتوافق مع أول يوم في الشهر
    const paddingDays = Array(firstDayOfMonth).fill(null);
    return [...paddingDays, ...daysArray];
  };

  const prev = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const next = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const renderDays = () => {
    const days = getDaysInMonth(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // لضبط الوقت على منتصف الليل للتأكد من المطابقة

    return days.map((day, index) => {
      if (!day) return <div key={index} className="p-2 h-32" />; // الأيام الفارغة
      const dayData = daysData.find(
        (d) => new Date(d.date).toDateString() === day.toDateString()
      );
      const isBeforeToday = day.getTime() < today.getTime();

      return (
        <div
          key={day.toISOString()}
          onClick={() => !isBeforeToday && handleDayClick(day)} // منع النقر على الأيام السابقة
          className={`p-2 h-32 cursor-pointer 
                        ${
                          day.getMonth() !== currentDate.getMonth()
                            ? "text-gray-400"
                            : ""
                        } 
                        ${
                          day.getTime() === today.getTime()
                            ? "bg-green-200 text-red-700"
                            : "bg-white"
                        }
                        ${
                          isBeforeToday ? "pointer-events-none opacity-50" : ""
                        }`} // تعطيل الأيام السابقة
        >
          <div className="flex justify-between items-center">
            <span className="font-bold">{day.getDate()}</span>
            {dayData && (
              <span
                className={`text-sm p-1 rounded-md font-bold ${
                  dayData.is_vacation
                    ? "bg-green-500 text-white"
                    : "bg-themeColor-500 text-white"
                }`}
              >
                {dayData.is_vacation ? "يوم عطلة" : "يوم مناوبة"}
              </span>
            )}
          </div>
          <div className="text-sm md:hidden text-gray-600">
            {daysOfWeek[day.getDay()]} {/* اليوم الأسبوعي بناءً على getDay() */}
          </div>
          {dayData && dayData.value && (
            <div className="text-sm text-gray-600">
              القيمة:{" "}
              {typeof dayData.value === "object"
                ? JSON.stringify(dayData.value)
                : dayData.value}
            </div>
          )}
        </div>
      );
    });
  };

  const handleDayClick = (day) => {
    const dayData = daysData.find(
      (d) => new Date(d.date).toDateString() === day.toDateString()
    );
    setSelectedDay(day);
    setSelectedData(dayData);
    setShowForm(true);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "overlay") {
      setShowForm(false);
    }
  };

  return (
    <div className="relative">
      <div className={`max-w-7xl mx-auto mt-6 p-4`}>
        <div className="w-full mb-12 flex flex-wrap items-center justify-between p-4 bg-themeColor-500 border-b space-y-4 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl text-white font-bold w-full sm:w-auto text-center sm:text-left">
            التقويم
          </h1>
          <div className="text-white flex items-center space-x-4 w-full sm:w-auto justify-center sm:justify-end">
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

        <div className="grid grid-cols-2 md:grid-cols-7 gap-px bg-gray-200">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="bg-white hidden md:block p-2 text-center font-medium text-indigo-600"
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
              selectedEntities={selectedEntities}
            />
          </div>
        </div>
      )}
    </div>
  );
}
