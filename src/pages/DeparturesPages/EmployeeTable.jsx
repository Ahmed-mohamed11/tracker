import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus } from 'lucide-react'

export default function LeaveManagement() {
    return (
        <div className="bg-gray-100 mt-10 p-6 font-sans" dir="rtl">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">المغادرات</h1>
                <button className="border-2 rounded-full bg-themeColor-500 p-2 text-white">
                    <Plus className="h-6 w-6" />
                </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <select className="rounded-md border p-2">
                    <option>البحث برقم الطلب</option>
                </select>
                <select className="rounded-md border p-2">
                    <option>حالة الطلب</option>
                </select>
                <div className="flex items-center rounded-md border bg-white">
                    <input type="date" className="flex-grow p-2" value="2024-9-22" />
                    <span className="px-2 text-gray-500">-</span>
                    <input type="date" className="flex-grow p-2" value="2024-9-22" />
                </div>
                <select className="rounded-md border p-2">
                    <option>نوع الطلب</option>
                </select>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <select className="rounded-md border p-2">
                    <option>اختر الموظف</option>
                </select>
                <div className="col-span-2"></div>
                <button className="rounded-md bg-themeColor-500 p-2 text-white">عرض</button>
            </div>

            <div className="overflow-x-auto rounded-lg bg-white shadow">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-right text-sm font-semibold text-gray-600">
                            <th className="p-3">رقم الطلب</th>
                            <th className="p-3">الرقم الوظيفي</th>
                            <th className="p-3">اسم الموظف</th>
                            <th className="p-3">حالة الطلب</th>
                            <th className="p-3">نوع الطلب</th>
                            <th className="p-3">من وقت</th>
                            <th className="p-3">إلى وقت</th>
                            <th className="p-3">من تاريخ</th>
                            <th className="p-3">إلى تاريخ</th>
                            <th className="p-3">مدة المغادرة</th>
                            <th className="p-3">تاريخ تحديث الطلب</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Add table rows here */}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">عرض 1 - 10</span>
                <div className="flex items-center space-x-2">
                    <button className="rounded p-1 hover:bg-gray-200">
                        <ChevronsRight className="h-5 w-5" />
                    </button>
                    <button className="rounded p-1 hover:bg-gray-200">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    <span className="mx-2 text-sm">صفحة 1 من 5</span>
                    <button className="rounded p-1 hover:bg-gray-200">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button className="rounded p-1 hover:bg-gray-200">
                        <ChevronsLeft className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}