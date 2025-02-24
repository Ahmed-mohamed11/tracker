import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

export default function VerificationSettings() {
    const [faceRecognitionLevel, setFaceRecognitionLevel] = useState("easy");
    const [voiceRecognitionLevel, setVoiceRecognitionLevel] = useState("easy");

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    console.error('No token found in cookies');
                    return;
                }

                const response = await axios.get("https://bio.skyrsys.com/api/company/company-data/", {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });

                const { face_recognition_level, voice_recognition_level } = response.data;
                setFaceRecognitionLevel(face_recognition_level);
                setVoiceRecognitionLevel(voice_recognition_level);
            } catch (error) {
                console.error("Error fetching company data", error);
                if (error.response) {
                    console.error("Server responded with:", error.response.data);
                }
            }
        };

        fetchCompanyData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new URLSearchParams();
        formData.append("face_recognition_level", faceRecognitionLevel);
        formData.append("voice_recognition_level", voiceRecognitionLevel);

        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.patch("https://bio.skyrsys.com/api/company/update/", formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            console.log("Update successful", response.data);
            // Success alert
            Swal.fire({
                icon: 'success',
                title: 'تم التحديث بنجاح',
                text: 'تم تحديث إعدادات التحقق.',
                confirmButtonText: 'موافق',
            });
        } catch (error) {
            console.error("Error updating company info", error);
            if (error.response) {
                console.error("Server responded with:", error.response.data);
                // Error alert
                Swal.fire({
                    icon: 'error',
                    title: 'فشل التحديث',
                    text: 'حدث خطأ أثناء تحديث الإعدادات. حاول مرة أخرى.',
                    confirmButtonText: 'موافق',
                });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="space-y-4 mb-5">
                <div className="flex justify-between items-center">
                    <p className="font-medium text-black">مستوى بصمة الوجه</p>
                    <select
                        className="w-1/2 border text-black rounded-md px-3 py-2 text-right"
                        value={faceRecognitionLevel}
                        onChange={(e) => setFaceRecognitionLevel(e.target.value)}
                    >
                        <option value="easy">سهل</option>
                        <option value="medium">متوسط</option>
                        <option value="hard">صعب</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <p className="font-medium text-black">مستوى بصمة الصوت</p>
                    <select
                        className="w-1/2 border rounded-md text-black px-3 py-2 text-right"
                        value={voiceRecognitionLevel}
                        onChange={(e) => setVoiceRecognitionLevel(e.target.value)}
                    >
                        <option value="easy">سهل</option>
                        <option value="medium">متوسط</option>
                        <option value="hard">صعب</option>
                    </select>
                </div>
            </div>

            <button
                type="submit"
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
            >
                حفظ
            </button>
        </form>
    );
}
