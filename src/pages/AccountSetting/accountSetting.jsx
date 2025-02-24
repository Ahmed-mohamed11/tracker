import { useState } from 'react'
import { X } from 'lucide-react'

import AccountInfo from './accountInfo'
import VerificationSettings from './verificationSettings'
import AttendanceSettings from './AttendanceSettings'

export default function AccountSettings({ onClose }) {
    const [activeTab, setActiveTab] = useState('accountInfo')
    const [isVisible, setIsVisible] = useState(true) // حالة التحكم في إظهار النافذة

    const tabs = [
        { id: 'accountInfo', label: 'معلومات الحساب' },
        { id: 'verificationSettings', label: 'إعدادات التحقق' },
        { id: 'attendanceSettings', label: 'إعدادات الحضور' },
    ]

    // دالة إخفاء النافذة بسلاسة
    const handleClose = () => {
        setIsVisible(false)
        setTimeout(() => {
            onClose();
        }, 300)
    }

    // إغلاق النافذة عند النقر خارج الصندوق
    const handleOverlayClick = (e) => {
        if (e.target.id === 'modalOverlay') {
            handleClose();
        }
    }

    return (
        isVisible && (
            <div
                id="modalOverlay"
                className={`fixed z-50 inset-0 -mb-12  bg-black mt-20 bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleOverlayClick}
            >
                <div
                    className={`bg-white rounded-lg shadow-lg w-full max-w-5xl transform transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}
                    onClick={(e) => e.stopPropagation()} // منع إغلاق النافذة عند النقر داخل الصندوق
                >
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl text-gray-900  font-bold">إعدادات الحساب</h2>
                        <button className="text-gray-500 hover:text-gray-700" onClick={handleClose}>
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* تبويبات التنقل */}
                    <div className="flex border-b">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`px-4 py-2 ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* المحتوى المتغير بناءً على التبويب النشط */}
                    <div className="p-4">
                        {activeTab === 'accountInfo' && <AccountInfo />}
                        {activeTab === 'verificationSettings' && <VerificationSettings />}
                        {activeTab === 'attendanceSettings' && <AttendanceSettings />}
                    </div>


                </div>
            </div>
        )
    )
}
