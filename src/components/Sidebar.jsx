import { useState } from "react";
import {
  House,
  UserCircleGear,
  Warning,
  CardsThree,
  CaretDown,
  Network,

} from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";
import LogoWideLight from "../images/logoWide-light.png";
import LogoWideDark from "../images/gfx/logo22.png";
import { useI18nContext } from "../context/i18n-context";


const SidebarItem = ({
  icon,
  name,
  link,
  onClick,
  subItems,
  subItemsClick,
  isOpen,
  toggleSubMenu,
}) => {
  const location = useLocation();

  const isActive =
    location.pathname === link ||
    (subItems && subItems.some((sub) => location.pathname === sub.link));

  const handleClick = () => {
    if (subItems) {
      toggleSubMenu();
    } else {
      onClick();
    }
  };

  return (
    <div>
      <Link
        to={link}
        onClick={handleClick}
        className={classNames(
          isActive
            ? "bg-gradient-to-r from-indigo-500"
            : " text-white hover:bg-gradient-to-r hover:from-themeColor-500",
          "py-1.5 px-4 text-sm font-medium rounded-md flex items-center justify-between gap-2 duration-150 ease-linear cursor-pointer"
        )}
      >
        <div className="flex items-center gap-2">
          {icon}
          {name}
        </div>
        {subItems && (
          <div
            className={`transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
              }`}
          >
            <CaretDown size={20} />
          </div>
        )}
      </Link>

      {subItems && (
        <div
          className={`ml-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40" : "max-h-0"
            }`}
        >
          <div className="mt-2 space-y-1">
            {subItems.map((subItem, index) => {
              const isSubItemActive = location.pathname === subItem.link;
              return (
                <Link
                  key={index}
                  to={subItem.link}
                  onClick={subItemsClick}
                  className={classNames(
                    isSubItemActive
                      ? "bg-gradient-to-r from-indigo-500 "
                      : "text-sky-950 dark:text-white hover:bg-gradient-to-r hover:from-themeColor-500",
                    "py-1.5 px-4 text-base font-medium rounded-md flex gap-3"
                  )}
                >
                  <CardsThree size={20} />
                  {subItem.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ isSidebarOpen, closeSidebar, dark }) {
  const { t } = useI18nContext();
  const initialPath =
    localStorage.getItem("currentPath") ||
    `${import.meta.env.VITE_PUBLIC_URL}/`;
  const [role, setRole] = useState("admin");


  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const toggleSubMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const navigationAdmin = [
    {
      icon: <House size={25} />,
      name: "sideBar.dashboard",
      link: `${import.meta.env.VITE_PUBLIC_URL}/`,
    },
    {
      icon: <UserCircleGear size={25} />,
      name: "sideBar.registration",
      link: `${import.meta.env.VITE_PUBLIC_URL}/registration`,
    },

    {
      icon: <UserCircleGear size={25} />,
      name: "sideBar.departures",
      link: `${import.meta.env.VITE_PUBLIC_URL}/departures`,
    },

    {
      icon: <Network size={32} />,
      name: "sideBar.Administrative",
      link: `${import.meta.env.VITE_PUBLIC_URL}/entities`,
    },
  ];

  const navigationError = [
    {
      icon: <Warning size={25} />,
      name: "sideBar.error",
      link: "/*",
    },
  ];

  const selectedNavigation =
    role === "admin" ? navigationAdmin : navigationError;

  const [activeIndex, setActiveIndex] = useState(
    selectedNavigation.findIndex((item) => item.link === initialPath)
  );

  const handleItemClick = (index, link) => {
    setActiveIndex(index);
    localStorage.setItem("currentPath", link);
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  };

  return (
    <div className="flex h-screen bg-[#2d2d3f] border-r  border-gray-200 dark:border-gray-800 dark:shadow-xl overflow-y-auto">
      <nav
        className={`flex flex-col w-full bg-[#2d2d3f] text-white ${isSidebarOpen ? "block" : "hidden"
          }`}
      >
        <div className="flex py-2 pt-4 items-center justify-center h-16 z-20">
          <div className="flex items-center space-x-4">
            <button className="text-white hover:bg-[#2d2d3f] p-2 rounded-lg transition duration-300">
              <svg
                className="w-8 h-8 text-purple-500"
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
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">Tracker</h1>
          </div>
        </div>
        <div className="flex-grow  p-4">
          <div className="flex flex-col space-y-4 ">
            {selectedNavigation.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                name={t(item.name)}
                link={item.link}
                subItems={item.subItems}
                isOpen={openMenuIndex === index}
                toggleSubMenu={() => toggleSubMenu(index)}
                subItemsClick={() => {
                  if (window.innerWidth <= 768) {
                    closeSidebar();
                  }
                }}
                onClick={() => {
                  handleItemClick(index, item.link);
                  if (window.innerWidth <= 768) {
                    closeSidebar();
                  }
                  toggleSubMenu(null);
                }}
              />
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
