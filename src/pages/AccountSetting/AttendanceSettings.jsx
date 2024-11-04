import ToggleButton from "../../components/form/ToggleButton";
import FormNumber from "../../components/form/FormNumber";
import FormSelect from "../../components/form/FormSelect";

export default function AttendanceSettings() {
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
                        <FormNumber key={3} label=" الحد الادني لعدد الساعات " onChange={(e) => console.log(e.target.value)} />,
                        <FormNumber key={4} label=" الحد الاقصي لعدد الساعات " onChange={(e) => console.log(e.target.value)} />,
                        <FormSelect key={5} label=" اختر الجهات " onChange={(e) => console.log(e.target.value)} />,
                        <FormSelect key={6} label="   اختر الموظفين   " onChange={(e) => console.log(e.target.value)} />,
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
        <div className=" h-screen overflow-y-auto z-50 p-6 bg-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">إعدادات الحضور</h2>
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
                                    <ToggleButton label={subItem} handleToggle={() => { }} />
                                ) : (
                                    <div className="grid grid-cols-1  md:grid-cols-2 gap-4 w-full">
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
        </div>
    );
}
