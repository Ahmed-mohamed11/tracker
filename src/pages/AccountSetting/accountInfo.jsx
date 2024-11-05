import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'; 

export default function AccountInfo() {
    const [companyName, setCompanyName] = useState("");
    const [companyCode, setCompanyCode] = useState("");
    const [companyLogo, setCompanyLogo] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [originalLogo, setOriginalLogo] = useState(""); 
    const [initialCompanyCode, setInitialCompanyCode] = useState(""); 
    const fileInputRef = useRef();

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
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
                const companyData = response.data;
                      const { company_name, company_code, company_logo } = companyData;
                    setCompanyName(company_name);
                    setCompanyCode(company_code);
                    setOriginalLogo(company_logo);  
                    setPreviewImage(`https://bio.skyrsys.com${company_logo}`); 
                    setInitialCompanyCode(company_code); 
             } catch (error) {
                console.error("Error fetching company data", error);
            }
        };

        fetchCompanyData();
    }, []);

    useEffect(() => {
        if (initialCompanyCode && companyCode && companyCode !== initialCompanyCode) {
            Swal.fire({
                title: 'رمز الحساب فريد!',
                text: 'يجب إرسال الرمز الجديد لكل الموظفين.',
                icon: 'info',
                confirmButtonText: 'تم'
            });
        }
    }, [companyCode, initialCompanyCode]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setCompanyLogo(file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            console.log("company_logo", imageUrl);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('company_name', companyName);
        formData.append('company_code', companyCode);

        if (companyLogo) {
            formData.append('company_logo', companyLogo);
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

             const updatedLogoUrl = response.data.company_logo;  
            localStorage.setItem("companyLogo", updatedLogoUrl);

            Swal.fire({
                title: 'تم تحديث المعلومات بنجاح',
                icon: 'success',
                confirmButtonText: 'موافق'
            });
        } catch (error) {
            console.error("Error updating company info", error);
            Swal.fire({
                title: 'خطأ',
                text: 'لم يتم تحديث المعلومات.',
                icon: 'error',
                confirmButtonText: 'موافق'
            });
        }
    };

 

    const handleCancel = () => {
        setCompanyName("");
        setCompanyCode("");
        setCompanyLogo(null);
        setPreviewImage(null);
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
                                    src={`https://bio.skyrsys.com${originalLogo}`}
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
                <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-lg">إلغاء</button>
                <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    حفظ
                </button>
            </div>
        </div>
    );
}
