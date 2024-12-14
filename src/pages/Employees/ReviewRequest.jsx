import { useEffect, useState } from "react";
import { X, Play, Check, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

export default function ReviewRequest({ requestData, onClose }) {
    const [requestDetails, setRequestDetails] = useState(requestData);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setRequestDetails(requestData);
        if (requestData) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [requestData]);


    console.log(requestData);

    if (!requestDetails) return <div>Loading...</div>;

    return (
        <div className={`w-full fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`max-w-5xl p-10 rounded-lg overflow-hidden bg-white shadow-lg transition-transform transform ${isVisible ? 'translate-y-0' : '-translate-y-full'} duration-300`}>
                <div className="p-2 mb-4 flex justify-between items-center">
                    <h2 className="text-gray-600">مراجعة طلب تسجيل</h2>
                    <X className="text-gray-600 cursor-pointer" onClick={onClose} />
                </div>
                <div className="flex gap-4">
                    {/* القسم الثالث */}
                    <div className="w-1/3 shadow-md shadow-gray-400 border-r p-4 group">
                        <div className="bg-gray-300 p-2 mb-4 text-center group-hover:bg-blue-600 group-hover:text-white">
                            بصمة الوجه
                        </div>
                        {requestDetails.image ? (
                            <img src={requestDetails.image} alt="Profile" className="w-48 h-48 mx-auto mb-4 rounded" />
                        ) : (
                            <div className="text-gray-500">لا توجد صورة متاحة</div>
                        )}

                    </div>

                    {/* القسم الثاني */}
                    <div className="w-1/3 shadow-md shadow-gray-400 border-r p-4 group">
                        <div className="bg-gray-300 p-2 mb-4 text-center group-hover:bg-blue-600 group-hover:text-white">
                            بصمة الصوت
                        </div>
                        {requestDetails.voices && Array.isArray(requestDetails.voices) && requestDetails.voices.length > 0 ? (
                            <>
                                <div className="text-gray-600 mb-2">
                                    عدد الصوتيات: {requestDetails.voices.length}
                                </div>
                                {requestDetails.voices.map((voiceData) => (
                                    <div key={voiceData.id} className="flex items-center mb-4">
                                        <audio controls className="flex-grow">
                                            <source src={voiceData.file} type="audio/ogg" />
                                            متصفحك لا يدعم مشغل الصوت.
                                        </audio>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="text-gray-500">لا توجد تسجيلات صوتية متاحة</div>
                        )}
                    </div>

                    {/* القسم الأول */}
                    <div className="w-1/3 shadow-md shadow-gray-400 border-r p-4 group">
                        <div className="bg-gray-300 p-2 mb-4 text-center group-hover:bg-blue-600 group-hover:text-white">
                            الجهات
                        </div>
                        <div className="p-2">
                            <div className="bg-blue-100 p-2 mb-2 flex justify-between items-center">
                                <span>{requestDetails.entity?.title} </span>
                                <Check className="text-themeColor-500" />
                            </div>

                        </div>

                    </div>
                </div>

                <div className=" mt-4 gap-4 p-4 flex justify-items-start items-center">
                    <button className="w-1/2 bg-blue-500 text-white px-4 py-2 rounded">الموافقة على الطلب</button>
                    <button className="w-1/2 bg-red-500 text-white px-4 py-2 rounded"> رفض الطلب </button>

                </div>
            </div>
        </div>
    );
}
