import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ToggleButton from "../../components/form/ToggleButton";
import FormNumber from "../../components/form/FormNumber";
import FormSelect from "../../components/form/FormSelect";

export default function AttendanceSettings() {
    const [enableFaceRecognition, setEnableFaceRecognition] = useState(true);
    const [enableVoiceRecognition, setEnableVoiceRecognition] = useState(true);
    const [enableFingerprintRecognition, setEnableFingerprintRecognition] = useState(true);
    const [enableOvertime, setEnableOvertime] = useState(true);
    const [minimumHoursWorked, setMinimumHoursWorked] = useState("0.00");
    const [maximumHoursWorked, setMaximumHoursWorked] = useState("0.00");
    const [overtimeEmployees, setOvertimeEmployees] = useState([]); // Array of employee IDs or names

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new URLSearchParams();
        formData.append("enable_face_recognition", enableFaceRecognition);
        formData.append("enable_voice_recognition", enableVoiceRecognition);
        formData.append("enable_fingerprint_recognition", enableFingerprintRecognition);
        formData.append("enable_overtime", enableOvertime);
        formData.append("minimum_hours_worked", minimumHoursWorked);
        formData.append("maximum_hours_worked", maximumHoursWorked);

        // Append overtime employees array as multiple values for "overtime_employees"
        overtimeEmployees.forEach(employee => formData.append("overtime_empolyess", employee));

        try {
            const token = Cookies.get("token");
            if (!token) {
                console.error("No token found in cookies");
                return;
            }

            const response = await axios.patch("https://bio.skyrsys.com/api/company/update/", formData, {
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            console.log("Update successful", response.data);
        } catch (error) {
            console.error("Error updating attendance settings", error);
            if (error.response) {
                console.error("Server responded with:", error.response.data);
            }
        }
    };

    const PageData = [
        {
            title: "إحتساب تأخير الحضور",
            sub_title: ["التأخر بعد الفترة المرنة"],
        },
        {
            title: "اعدادات الموقع الجغرافي",
            sub_title: ["التحقق من الوقت الحالي"],
        },
        {
            title: "اعدادات العمل الاضافي",
            sub_title: [
                "العمل الاضافي",
                {
                    inputs: [
                        <FormNumber key={3} label=" الحد الادني لعدد الساعات " onChange={(e) => setMinimumHoursWorked(e.target.value)} />,
                        <FormNumber key={4} label=" الحد الاقصي لعدد الساعات " onChange={(e) => setMaximumHoursWorked(e.target.value)} />,
                        <FormSelect key={5} label=" اختر الجهات " onChange={(e) => console.log(e.target.value)} />,
                        <FormSelect key={6} label="   اختر الموظفين   " onChange={(e) => setOvertimeEmployees(e.target.value)} />, // Adjust as needed for multi-select handling
                    ],
                },
                "إحتساب الحضور المبكر ضمن العمل الإضافي",
            ],
        },
        {
            title: "اعدادات البصمه",
            sub_title: [
                "التحقق من بصمه الصوت",
                "التحقق من بصمه الصوره",
                "التحقق من بصمه اليد",
                "تحديد تسجيل الدخول من الهاتف المسجل فقط",
                {
                    inputs: [
                        <FormSelect key={7} label="   نسبة العينة العشوائية   " onChange={(e) => console.log(e.target.value)} />,
                    ],
                },
            ],
        },
        {
            title: "التحكم بالإجراء الخاص بتغيير حالة التحضير",
            sub_title: ["التحكم بالإجراء الخاص بتغيير حالة التحضير"],
        },
    ];

    return (
        <div className="h-screen overflow-y-auto z-50 p-6 bg-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">إعدادات الحضور</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PageData.map((item, index) => (
                        <div key={index} className="bg-white border border-gray-300 rounded-lg shadow-lg p-5">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">{item.title}</h3>
                            {item.sub_title.map((subItem, subIndex) => (
                                <div
                                    key={subIndex}
                                    className="flex items-center gap-4 mb-2 p-3 border border-gray-200 rounded-md bg-gray-50"
                                    style={{ minHeight: '50px' }}
                                >
                                    {typeof subItem === "string" ? (
                                        <ToggleButton label={subItem} handleToggle={() => {
                                            if (subItem === "العمل الاضافي") setEnableOvertime(!enableOvertime);
                                            if (subItem === "التحقق من بصمه الصوت") setEnableVoiceRecognition(!enableVoiceRecognition);
                                            if (subItem === "التحقق من بصمه الصوره") setEnableFaceRecognition(!enableFaceRecognition);
                                            if (subItem === "التحقق من بصمه اليد") setEnableFingerprintRecognition(!enableFingerprintRecognition);
                                        }} />
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                            {subItem.inputs.map((input, inputIndex) => (
                                                <div key={inputIndex} className="w-full">
                                                    {input}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white py-2 mb-40 px-4 rounded-md"
                >
                    حفظ 
                </button>
            </form>
        </div>
    );
}
