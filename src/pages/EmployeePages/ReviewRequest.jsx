import { X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Play, Check } from "lucide-react"

export default function ReviewRequest() {
    return (
        <div className="p-1 font-sans" dir="rtl">
            <div className="rounded-lg overflow-hidden">
                <div className="p-2 flex justify-between items-center">
                    <h2 className="text-gray-600">مراجعة طلب تسجيل</h2>
                    <X className="text-gray-600 cursor-pointer" />
                </div>
                <div className="flex gap-4">

                    {/* القسم الثالث */}
                    <div className="w-1/3 shadow-md shadow-gray-400 border-r p-4 group">
                        <div className="bg-gray-300 p-2 mb-4 text-center group-hover:bg-blue-600 group-hover:text-white">
                            بصمة الوجه
                        </div>
                        <img src="/placeholder.svg?height=200&width=200" alt="Profile" className="w-48 h-48 mx-auto mb-4 rounded" />
                        <div className="flex justify-center gap-2">
                            <button className="bg-green-500 text-white px-7 py-2 rounded mr-2">قبول</button>
                            <button className="bg-red-500 text-white px-7 py-2 rounded">رفض</button>
                        </div>
                    </div>

                    {/* القسم الثاني */}
                    <div className="w-1/3 shadow-md shadow-gray-400 border-r p-4 group">
                        <div className="bg-gray-300 p-2 mb-4 text-center group-hover:bg-blue-600 group-hover:text-white">
                            بصمة الصوت
                        </div>
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex items-center mb-4">
                                <Play className="text-blue-500 mr-2" />
                                <div className="bg-gray-300 h-2 flex-grow rounded"></div>
                            </div>
                        ))}
                    </div>




                    {/* القسم الأول */}
                    <div className="w-1/3 shadow-md shadow-gray-400 border-r p-4 group">
                        <div className="bg-gray-300 p-2 mb-4 text-center group-hover:bg-blue-600 group-hover:text-white">
                            الجهات
                        </div>
                        <div className="p-2">
                            <div className="bg-blue-100 p-2 mb-2 flex justify-between items-center">
                                <span>العنوان</span>
                                <Check className="text-green-500" />
                            </div>
                            <div className="bg-gray-100 p-2 flex justify-between items-center">
                                <span>الإدارة الرئيسية</span>
                                <Check className="text-green-500" />
                            </div>
                        </div>
                        <div className="flex justify-center mt-4 text-gray-600">
                            <ChevronsLeft className="mx-1" />
                            <ChevronLeft className="mx-1" />
                            <span>1-1 من 1</span>
                            <ChevronRight className="mx-1" />
                            <ChevronsRight className="mx-1" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-200 p-4 flex justify-between items-center">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">الموافقة على الطلب</button>
                    <div className="flex items-center">
                        <span className="text-blue-500 mr-2">i</span>
                        <span className="text-gray-600">
                            للموافقة على الطلب عليك مشاهدة جميع الفيديو والاستماع إلى جميع التسجيلات
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
