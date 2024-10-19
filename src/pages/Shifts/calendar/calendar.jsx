import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ShiftForm from './AddShift'

const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
]

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)) // يناير 2024
    const [view, setView] = useState('Month')
    const [tasks, setTasks] = useState({})
    const [showForm, setShowForm] = useState(false)
    const [selectedDay, setSelectedDay] = useState(null)

    const getDaysInMonth = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const days = new Date(year, month + 1, 0).getDate()
        return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1))
    }

    const prev = () => {
        if (view === 'Month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
        }
    }

    const next = () => {
        if (view === 'Month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
        }
    }

    const handleDayClick = (day) => {
        setSelectedDay(day)
        setShowForm(true)
    }

    const handleOutsideClick = (e) => {
        if (e.target.id === 'overlay') {
            setShowForm(false)
        }
    }

    const renderDays = () => {
        const days = getDaysInMonth(currentDate)
        return days.map((day) => (
            <div
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={`bg-white p-2 h-32 cursor-pointer ${day.getMonth() !== currentDate.getMonth() ? 'text-gray-400' : ''
                    }`}
            >
                <div className="flex justify-between items-center">
                    <span className="font-bold">{day.getDate()}</span>
                </div>
            </div>
        ))
    }

    return (
        <div className="relative">
            <div className={`max-w-7xl mx-auto mt-6 p-4 transition ${showForm ? 'blur-sm' : ''}`}>
                <div className="w-full mb-12 flex items-center justify-between p-4 bg-themeColor-500  border-b ">
                    <h1 className="text-2xl text-white font-bold">خطه الدوام</h1>
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
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
