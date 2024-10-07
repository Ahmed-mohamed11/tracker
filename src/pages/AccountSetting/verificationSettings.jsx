import React from 'react'

export default function verificationSettings() {
    return (
        <div className="p-4">


            <div className="space-y-4 mb-5">
                <div className="flex justify-between  items-center">

                    <p className="font-medium ">مستوى بصمة الوجه</p>


                    <select
                        id="faceprint"
                        className="w-1/2 border rounded-md px-3 py-2 text-right"
                        defaultValue="easy"
                    >
                        <option value="easy">سهل</option>
                        <option value="medium">متوسط</option>
                        <option value="hard">صعب</option>
                    </select>
                </div>

            </div>

            <div className="space-y-4">
                <div className="flex justify-between  items-center">

                    <p className="font-medium ">مستوى بصمة الصوت
                    </p>


                    <select
                        id="faceprint"
                        className="w-1/2 border rounded-md px-3 py-2 text-right"
                        defaultValue="easy"
                    >
                        <option value="easy">سهل</option>
                        <option value="medium">متوسط</option>
                        <option value="hard">صعب</option>
                    </select>
                </div>

            </div>
        </div>
    )
}
