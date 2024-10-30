import React from "react";
import ToggleButton from "../../components/form/ToggleButton";
import FormText from "../../components/form/FormText";
import FormNumber from "../../components/form/FormNumber";

export default function AttendanceSettings() {
  const PageData = [
    {
      title: "احتساب تأخير الحضور",
      sub_title: [
        "التاخير بعد الفتره المرنه",
        {
          inputs: [<FormText key={0} />],
        },
      ],
    },
    {
      title: "العمل عن بعد",
      sub_title: [
        "التاخير بعد الفتره المرنه",
        {
          inputs: [<FormText key={1} />],
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
          inputs: [<FormText key={2} />],
        },
      ],
    },
    {
      title: "اعدادات العمل الاضافي",
      sub_title: [
        "العمل الاضافي",
        {
          inputs: [<FormText key={3} />],
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {PageData.map((item, index) => (
        <div key={index} className="flex flex-col">
          <div className="mb-4 border-2 border-gray-300 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {item.title}
            </label>
            {item.sub_title.map((subItem, subIndex) => (
              <div
                key={subIndex}
                className="mb-4 flex items-center justify-start border-2 border-gray-300 p-2 rounded-md"
              >
                {typeof subItem === "string" ? (
                  <ToggleButton label={subItem} handleToggle={() => {}} />
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
  );
}
