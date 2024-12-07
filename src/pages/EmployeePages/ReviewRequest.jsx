import { useEffect, useState } from "react";
import { X, Check, CheckCheck } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";

export default function ReviewRequest({
  requestData,
  onClose,
  approveRequest,
  refuseRequest,
  fetchData,
}) {
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

  const approveImage = async (Id) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found in cookies");
        return;
      }
      const response = await axios.patch(
        `https://bio.skyrsys.com/api/registration-requests/${Id}/image-approval/`,
        { is_image_approved: true },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      if (response.status === 200) {
        toast.success("تمت الموافقة على الصورة بنجاح!", {
          pauseOnHover: false,
        });
        console.log("Image approved successfully.");
        // تحديث البيانات المحلية
        setRequestDetails((prev) => ({
          ...prev,
          is_image_approved: true,
        }));
      }
      fetchData();
    } catch (error) {
      toast.error("حدث خطأ أثناء الموافقة على الصورة.", {
        pauseOnHover: false,
      });
      console.error("Error approving image:", error);
    }
  };

  const refuseImage = async (Id) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found in cookies");
        return;
      }
      const response = await axios.patch(
        `https://bio.skyrsys.com/api/registration-requests/${Id}/image-approval/`,
        { is_image_approved: false },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      if (response.status === 200) {
        console.log("Image refused successfully.");
        toast.success("تم رفض الصورة بنجاح!", { pauseOnHover: false });
        // تحديث البيانات المحلية
        setRequestDetails((prev) => ({
          ...prev,
          is_image_approved: false,
        }));
      }
      fetchData();
    } catch (error) {
      toast.error("حدث خطأ أثناء رفض الصورة.", { pauseOnHover: false });
      console.error("Error refusing image:", error);
    }
  };

  const handleApprove = () => {
    approveRequest(requestDetails.id);
    onClose(); // Close the form after approval
  };

  const handleRefuse = () => {
    refuseRequest(requestDetails.id);
    onClose(); // Close the form after refusal
  };

  if (!requestDetails) return <div>Loading...</div>;

  console.log(requestDetails);

  return (
    <div
      className={`w-full fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <ToastContainer />
      <div
        className={`max-w-5xl p-10 rounded-lg overflow-hidden bg-white shadow-lg transition-transform transform ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } duration-300`}
      >
        <div className="p-2 mb-4 flex justify-between items-center">
          <h2 className="text-gray-600">مراجعة طلب تسجيل</h2>
          <X className="text-gray-600 cursor-pointer" onClick={onClose} />
        </div>
        <div className="flex md:flex-row flex-col gap-4">
          {/* القسم الخاص بالصورة */}
          <div className="md:w-1/2 relative shadow-md shadow-gray-400 border-r p-4 group flex flex-col justify-between">
            <div>
              <div className="bg-gray-300 p-2 mb-4 text-center group-hover:bg-blue-600 group-hover:text-white">
                بصمة الوجه
              </div>
              {requestDetails.image ? (
                <div className="relative">
                  <img
                    src={requestDetails.image}
                    alt={requestDetails.first_name}
                    className="w-48 h-48 mx-auto mb-4 rounded"
                  />
                  {requestDetails.is_image_approved && (
                    <div
                      className="absolute top-1/2 left-1/2 
                bg-black bg-opacity-40 rounded
                w-48 h-48 -translate-x-1/2 -translate-y-1/2"
                    ></div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500">لا توجد صورة متاحة</div>
              )}
            </div>

            <div className="gap-4 flex md:flex-row flex-col justify-center items-center">
              {!requestDetails.is_image_approved ? (
                <button
                  onClick={() => approveImage(requestDetails.id)}
                  className="w-fit bg-blue-500 text-white px-4 py-2 rounded"
                >
                  موافقة على الصورة
                </button>
              ) : (
                <div
                  className="w-24 bg-green-500 text-white px-4 py-2 flex flex-col items-center gap-1 text-center
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full mx-auto"
                >
                  تمت الموافقة <CheckCheck />
                </div>
              )}
              <button
                onClick={() => refuseImage(requestDetails.id)}
                className="w-fit bg-red-500 text-white px-4 py-2 rounded"
              >
                رفض الصورة
              </button>
            </div>
          </div>

          {/* القسم الثاني */}
          <div className="md:w-1/2 shadow-md shadow-gray-400 border-r p-4 group flex flex-col justify-between">
            <div>
              <div className="bg-gray-300 p-2 mb-4 text-center group-hover:bg-blue-600 group-hover:text-white">
                بصمة الصوت
              </div>
              {requestDetails.voices &&
              Array.isArray(requestDetails.voices) &&
              requestDetails.voices.length > 0 ? (
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
          </div>
        </div>
        {requestData.status && (
          <div className=" mt-4 gap-4 p-4 flex justify-items-start items-center">
            <button
              onClick={handleApprove}
              className="w-1/2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              الموافقة على الطلب
            </button>
            <button
              onClick={handleRefuse}
              className="w-1/2 bg-red-500 text-white px-4 py-2 rounded"
            >
              {" "}
              رفض الطلب{" "}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
