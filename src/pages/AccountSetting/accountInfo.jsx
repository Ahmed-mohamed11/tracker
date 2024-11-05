import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'; // Import SweetAlert2 if you haven't already

export default function AccountInfo() {
    const [companyName, setCompanyName] = useState("");
    const [companyCode, setCompanyCode] = useState("");
    const [companyLogo, setCompanyLogo] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [initialCompanyCode, setInitialCompanyCode] = useState(""); // Store initial code for comparison

    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setCompanyLogo(file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            console.log("company_logo", imageUrl);
        }
    };

    useEffect(() => {
        const token = Cookies.get("token");
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
            const user = JSON.parse(storedUser);
            setCompanyName(user.companyName);
            setCompanyCode(user.companyCode);
            setInitialCompanyCode(user.companyCode); // Store the initial code
            setCompanyLogo(user.companyLogo);
        }
    }, []);

    useEffect(() => {
        if (initialCompanyCode && companyCode && companyCode !== initialCompanyCode) {
            // Show notification when the company code changes
            Swal.fire({
                title: 'رمز الحساب فريد!',
                text: 'يجب إرسال الرمز الجديد لكل الموظفين.',
                icon: 'info',
                confirmButtonText: 'تم'
            });
        }
    }, [companyCode, initialCompanyCode]);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('company_name', companyName);
        formData.append('company_code', companyCode);

        if (companyLogo) {
            formData.append('company_logo', companyLogo);
            console.log("company_logo", companyLogo);
        }

        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.patch("https://bio.skyrsys.com/api/company/update/", formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            console.log("Update successful", response.data);
        } catch (error) {
            console.error("Error updating company info", error);
        }
    };

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-2/4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">اسم الحساب</label>
                        <input
                            type="text"
                            className="w-full text-black border rounded-md px-3 py-2"
                            placeholder="project FL"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">رمز الحساب</label>
                        <input
                            type="text"
                            className="w-full border text-black rounded-md px-3 py-2"
                            placeholder="PFL"
                            value={companyCode}
                            onChange={(e) => setCompanyCode(e.target.value)}
                        />
                    </div>
                </div>

                <div className="w-full md:w-2/4">
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Company Logo" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <img
                                    src={`https://bio.skyrsys.com${companyLogo}`}
                                    alt="Company Logo" className="w-full h-full rounded-full object-cover" />
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <div className="flex justify-center gap-5">
                            <button onClick={handleUploadClick} className="bg-themeColor-500 text-white px-4 py-2 rounded-lg mr-2">
                                تحميل
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between p-4 border-t">
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg">إلغاء</button>
                <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    حفظ
                </button>
            </div>
        </div>
    );
}
