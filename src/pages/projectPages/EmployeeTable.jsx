import { IoSearch } from "react-icons/io5";
import { FaFilter } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { FaPlus } from "react-icons/fa";

const tasks = [
    { id: 1, name: 'Upload feed and Reels in Instagram', status: 'In progress', users: 5, progress: 75, website: true, timeTracking: '6:47/8:00', dueDate: '23 Nov 2022' },
    { id: 2, name: 'Crossplatform analysis', status: 'Completed', users: 2, progress: 100, website: true, timeTracking: '7:00', dueDate: '03 Nov 2022' },
    { id: 3, name: 'Product features analysis', status: 'In progress', users: 3, progress: 50, website: true, timeTracking: '3:29/8:00', dueDate: 'Yesterday' },
    { id: 4, name: 'Create user story', status: 'Completed', users: 3, progress: 100, website: true, timeTracking: '8:00', dueDate: '23 Nov 2022' },
    { id: 5, name: 'Users profile update', status: 'In progress', users: 2, progress: 20, website: true, timeTracking: '4:2/8:00', dueDate: 'Yesterday' },
    { id: 6, name: 'User flow update', status: 'Completed', users: 3, progress: 100, website: true, timeTracking: '7:00', dueDate: '23 Oct 2022' },
    { id: 7, name: 'Update design system', status: 'In review', users: 2, progress: 100, website: true, timeTracking: '7:00', dueDate: '02 Now 2022' },
    { id: 8, name: 'Create a new logo', status: 'Completed', users: 2, progress: 100, website: true, timeTracking: '5:00', dueDate: '30 Oct 2022' },
    { id: 9, name: 'Screen structure', status: 'In review', users: 2, progress: 100, website: true, timeTracking: '2:00', dueDate: '23 Nov 2022' },
    { id: 10, name: 'Implement GPT 3', status: 'In progress', users: 2, progress: 25, website: true, timeTracking: '3:1/8:00', dueDate: 'Today' },
]

export default function TaskManagement() {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-6">All Tasks</h1>
            <div className="flex justify-between items-center mt-6">
                <div className="flex space-x-4">
                    <div className="relative">
                        <input type="text" placeholder="Search..." className="bg-gray-800 text-white px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <IoSearch className="absolute right-3 top-2.5 text-gray-400" size={20} />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">Search</button>
                    <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200 flex items-center">
                        <FaFilter size={20} className="mr-2" />
                        Filter
                    </button>
                    <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200 flex items-center">
                        <IoMdSettings size={20} className="mr-2" />
                        Configurations
                    </button>
                </div>
                <button
                    onClick={handleOpenCreate}

                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center">
                    <FaPlus size={20} className="mr-2" />
                    Add new task
                </button>
            </div>
            <div className="flex space-x-4 mb-6">
                <label className="flex items-center">
                    <input type="radio" name="filter" className="form-radio text-blue-600" />
                    <span className="ml-2">All</span>
                </label>
                <label className="flex items-center">
                    <input type="radio" name="filter" className="form-radio text-blue-600" />
                    <span className="ml-2">Completed tasks</span>
                </label>
                <label className="flex items-center">
                    <input type="radio" name="filter" className="form-radio text-blue-600" />
                    <span className="ml-2">Tasks in progress</span>
                </label>
                <label className="flex items-center">
                    <input type="radio" name="filter" className="form-radio text-blue-600" />
                    <span className="ml-2">Tasks in review</span>
                </label>
            </div>
            <table className="w-full">
                <thead>
                    <tr className="text-left text-gray-500">
                        <th className="py-2 px-4">TASK</th>
                        <th className="py-2 px-4">STATUS</th>
                        <th className="py-2 px-4">USERS</th>
                        <th className="py-2 px-4">PROGRESS</th>
                        <th className="py-2 px-4">PREVIEW</th>
                        <th className="py-2 px-4">TIME TRACKING</th>
                        <th className="py-2 px-4">DUE DATE</th>
                        <th className="py-2 px-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id} className="border-t border-gray-800">
                            <td className="py-4 px-4">{task.name}</td>
                            <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${task.status === 'Completed' ? 'bg-green-500 text-green-900' :
                                    task.status === 'In progress' ? 'bg-blue-500 text-blue-900' :
                                        'bg-yellow-500 text-yellow-900'
                                    }`}>
                                    {task.status}
                                </span>
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex -space-x-2">
                                    {[...Array(task.users)].map((_, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-500 border-2 border-gray-800"></div>
                                    ))}
                                    {task.users > 3 && <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-xs">+{task.users - 3}</div>}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className={`bg-blue-600 h-2.5 rounded-full`} style={{ width: `${task.progress}%` }}></div>
                                </div>
                                <span className="text-xs text-gray-500 mt-1">{task.progress}%</span>
                            </td>
                            <td className="py-4 px-4">
                                {task.website && <span className="text-blue-500 underline">Website</span>}
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex items-center">
                                    <span className="mr-2">{task.timeTracking}</span>
                                    {task.status === 'In progress' ? (
                                        <Pause size={20} className="text-orange-500" />
                                    ) : (
                                        <Play size={20} className="text-green-500" />
                                    )}
                                </div>
                            </td>
                            <td className="py-4 px-4">{task.dueDate}</td>
                            <td className="py-4 px-4">
                                <MoreVertical size={20} className="text-gray-500" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-6 flex justify-between items-center">
                <span className="text-gray-500">Showing 1-10 of 1000</span>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-200">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-200">1</button>
                    <button className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition duration-200">2</button>
                    <button className="px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-200">3</button>
                    <span className="px-3 py-1">...</span>
                    <button className="px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-200">100</button>
                    <button className="px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-200">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}