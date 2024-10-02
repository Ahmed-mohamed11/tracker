import { useState, useEffect, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bell, MagnifyingGlass, UserCheck } from '@phosphor-icons/react';

export default function Navbar() {
  const [profilePic, setProfilePic] = useState('');

   useEffect(() => {
     setProfilePic('/placeholder.svg?height=32&width=32');
  }, []);

  return (
    <nav className="w-full bg-[#1e1e2d] text-white p-4 flex items-center justify-between shadow-md">
      

      <div className="flex-1 max-w-xl px-4">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            className="w-full bg-[#2d2d3f] border-none pl-10 pr-4 py-2 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            placeholder="Search here..."
            type="search"
          />
        </div>
      </div>

      <div className="flex items-end space-x-4">
        <Menu as="div" className="relative">
          <div>
            <Menu.Button className="rounded-full mx-5 focus:outline-none focus:ring-2 focus:ring-purple-500">
              <UserCheck size={28} className="text-white" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/profile"
                    className={`${active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700`}
                  >
                    Profile
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/settings"
                    className={`${active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700`}
                  >
                    Settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/logout"
                    className={`${active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700`}
                  >
                    Log out
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>

        <button className="text-white hover:bg-[#2d2d3f] p-2 rounded-full transition duration-300">
          <Bell className="h-7 w-7" />
        </button>

        <button className="text-white hover:bg-[#2d2d3f] p-2 rounded-full transition duration-300">
          <svg
            className="h-7 w-7 text-purple-500"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 12c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9 9-4.03 9-9z" />
            <path d="M15 9.354a4 4 0 1 0 0 5.292" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
