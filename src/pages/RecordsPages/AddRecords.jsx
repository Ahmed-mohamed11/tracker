import { useState } from "react";
import { Plus, X } from "@phosphor-icons/react";
// import api from "../../../ApiUrl";


import axios from "axios";
import { useI18nContext } from "../../context/i18n-context";
import FormText from "../../components/form/FormText";

export default function CreateStage({
    closeModal,
    modal,
    refreshData,
}) {

    const [formData, setFormData] = useState({
        id: 0,
        text: "",
        lang: "",

    });

    const { t } = useI18nContext();

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === "team_id") {
            processedValue = parseInt(value, 10);
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: processedValue,
        }));

        console.log(formData);
    };

    const createStage = async (e) => {
        e.preventDefault();

        try {
            console.log("createStage createStage");

            const response = axios.post(`https://bio.skyrsys.com/api/company/voices/`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Data", response.data);

            setFormData({
                id: "",
                text: "",
                lang: "",
            });

            closeModal();
            refreshData();
        } catch (error) {
            setErrorMsg(error.response.data.error);
            setShowError(true);
        }
    };


    const [errorMsg, setErrorMsg] = useState("");
    const [showError, setShowError] = useState(false);

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <>
            <div
                onClick={handleBackgroundClick}
                className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
          absolute top-1/2 -translate-x-1/2 -translate-y-1/2
          z-50 justify-center items-center ${modal ? "left-1/2" : "-left-[100%]"
                    }
          bg-black bg-opacity-40 w-full h-full `}
            >
                <div
                    className={`CreateCenter p-4 w-full max-w-2xl pb-10 bg-white
             dark:bg-gray-800 rounded-r-lg duration-200 ease-linear
             ${modal ? "absolute left-0" : "absolute -left-[100%]"}
             h-screen overflow-auto`}
                    dir="rtl"
                >
                    {/* Modal content */}
                    <div className="relative p-4 bg-white dark:bg-gray-800 sm:p-5">
                        {/* Modal header */}
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear">
                                {t("stagesForm.createStage")}
                            </h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 mr-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <X size={18} weight="bold" />
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {/* Modal body */}
                        <form onSubmit={createStage}>
                            <div className="grid gap-4 mb-4 grid-cols-1 sm:grid-cols-2">
                                <FormText
                                    label="ادخل النص"
                                    name="text"
                                    value={formData.text}
                                    placeholder="ادخل النص"
                                    required={true}
                                    onChange={handleChange}
                                />

                                {/* email */}

                                <FormText
                                    label="ادخل اللغه"
                                    name="lang"
                                    value={formData.lang}
                                    onChange={handleChange}
                                    placeholder="ادخل اللغه"
                                    required={true}
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex gap-2 items-center justify-center duration-150 ease-linear
                      text-white bg-themeColor-500 hover:bg-themeColor-700 
                      focus:ring-4 focus:ring-themeColor-300 
                      font-medium rounded-lg text-sm px-5 py-2.5 
                      dark:bg-themeColor-300 dark:hover:bg-themeColor-500 dark:text-themeColor-800
                      dark:hover:text-white
                      focus:outline-none dark:focus:ring-themeColor-800"
                            >
                                <Plus size={18} weight="bold" />
                                {t("stagesForm.createStage")}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
