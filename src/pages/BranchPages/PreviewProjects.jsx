import React, { useState, useEffect, useCallback } from "react";
import { X } from "@phosphor-icons/react";
import Cookies from 'js-cookie';
import axios from 'axios';

const PreviewProjects = ({ closeModal, projectId, modal }) => {
    const [projectData, setProjectData] = useState({});

    const fetchProjectData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.get(`https://dashboard.cowdly.com/api/clients/${projectId}/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            if (response.data) {
                const { id, name, email, phone, address } = response.data;
                setProjectData({ id, name, email, phone, address });
            }
        } catch (error) {
            console.error('Error fetching project data:', error.response?.data || error.message);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            fetchProjectData();
        }
    }, [fetchProjectData, projectId]);

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div
            onClick={handleBackgroundClick}
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center ${modal ? 'visible' : 'invisible'}`}
        >
            <div
                className="font-sans bg-white rounded-lg shadow-lg w-full max-w-4xl h-auto transition-transform duration-300 ease-in-out"
                style={{ width: '40vw', zIndex: 50 }}
            >
                <div className="relative text-gray-900">
                    <div className="bg-themeColor-700 w-full flex justify-between items-center text-white p-3 mb-4 rounded-t-lg border-b">
                        <h3 className="text-lg font-semibold">View Car</h3>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 hover:bg-gray-200 rounded-lg text-sm p-1.5 inline-flex items-center"
                        >
                            <X size={18} weight="bold" />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="flex justify-center my-8">

                    </div>
                    <form>
                        <div className="gap-4 mb-4 px-4">
                            {/* ID Field */}
                            <div className="flex justify-between items-center gap-3">
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700">ID</label>
                                    <input
                                        type="text"
                                        name="id"
                                        value={projectData.id || ''}
                                        placeholder="Client ID"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-themeColor-500 focus:border-themeColor-500 sm:text-sm"
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Name Field */}
                            <div className="flex justify-between items-center gap-3 mt-3">
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={projectData.name || ''}
                                        placeholder="Client Name"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-themeColor-500 focus:border-themeColor-500 sm:text-sm"
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="flex justify-between items-center gap-3 mt-3">
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        value={projectData.email || ''}
                                        placeholder="Email Address"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-themeColor-500 focus:border-themeColor-500 sm:text-sm"
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div className="flex justify-between items-center gap-3 mt-3">
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={projectData.phone || ''}
                                        placeholder="Phone Number"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-themeColor-500 focus:border-themeColor-500 sm:text-sm"
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Address Field */}
                            <div className="flex justify-between items-center gap-3 mt-3">
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={projectData.address || ''}
                                        placeholder="Address"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-themeColor-500 focus:border-themeColor-500 sm:text-sm"
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center gap-2 mt-5">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-8 py-2 w-fit bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default React.memo(PreviewProjects);