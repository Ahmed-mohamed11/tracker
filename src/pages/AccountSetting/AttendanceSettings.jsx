// import React from "react";
import ToggleButton from "../../components/form/ToggleButton";
import FormText from "../../components/form/FormText";
import FormNumber from "../../components/form/FormNumber";
import FormSelect from "../../components/form/FormSelect";

export default function AttendanceSettings() {
    const PageData = [
        {
            title: "احتساب تأخير الحضور",
            sub_title: [
                "التاخير بعد الفتره المرنه",

            ],
        },
        {
            title: "العمل عن بعد",
            sub_title: [
                "التاخير بعد الفتره المرنه",

            ],
        },
        {
            title: "اعدادات العمل الاضافي",
            sub_title: [
                "العمل الاضافي",
                {
                    inputs: [
                        <FormNumber key={3}
                            label=" الحد الادني لعدد الساعات "
                            onChange={(e) => {
                                console.log(e.target.value);
                            }}
                        />,
                        <FormNumber key={4}
                            label=" الحد الاقصي لعدد الساعات "
                            onChange={(e) => {
                                console.log(e.target.value);
                            }}
                        />,

                        <FormSelect key={5}
                            label=" اختر الجهات "
                            onChange={(e) => {
                                console.log(e.target.value);
                            }}
                        />,
                        <FormSelect key={6}
                            label="   اختر الموظفين   "
                            onChange={(e) => {
                                console.log(e.target.value);
                            }}
                        />,

                    ],

                },
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
                        <FormSelect key={6}
                            label="   اختر الموظفين   "
                            onChange={(e) => {
                                console.log(e.target.value);
                            }}
                        />,
                    ],
                },
            ],
        },

        {
            title: "اعدادات الموقع الجغرافي",
            sub_title: [
                "التحقق من الوقت الحالي",

            ],
        }

    ];

    return (
        <div className="max-h-screen">
            <div className="grid grid-cols-2 gap-3 overflow-y-auto">
                {PageData.map((item, index) => (
                    <div key={index} className="flex flex-col">
                        <div className="mb-4 border-2 border-gray-300 p-4 rounded-md">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                {item.title}
                            </label>
                            {item.sub_title.map((subItem, subIndex) => (
                                <div
                                    key={subIndex}
                                    className="mb-4 w-full grid grid-cols-2 items-center gap-4 justify-start border-2 border-gray-300 p-2 rounded-md"
                                >
                                    {typeof subItem === "string" ? (
                                        <ToggleButton label={subItem} handleToggle={() => { }} />
                                    ) : (
                                        subItem.inputs.map((input, inputIndex) => (
                                            <div key={inputIndex} className="w-full">
                                                {input}
                                            </div>
                                        ))
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
