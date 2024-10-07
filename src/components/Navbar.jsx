import { useState, useEffect, useRef } from "react";
import {
  House,
  UserCircleGear,
  Warning,
  Network,
  CaretDown,
  List,
  X,
  Clock,
  Gear,
} from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";
import { useI18nContext } from "../context/i18n-context";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NavbarItem = ({
  icon,
  name,
  link,
  onClick,
  subItems,
  isOpen,
  toggleSubMenu,
  closeSubMenu,
}) => {
  const location = useLocation();
  const ref = useRef();

  useEffect(() => {
    // دالة للتحقق مما إذا كان النقر خارج القائمة الفرعية
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        closeSubMenu(); // إغلاق القائمة الفرعية إذا كان النقر خارجها
      }
    };

    // إضافة مستمع للنقرات
    document.addEventListener("mousedown", handleClickOutside);

    // إزالة المستمع عند إلغاء المكون
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeSubMenu]);

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
    <div className="relative" ref={ref}>
      <Link
        to={link}
        onClick={handleClick}
        className={classNames(
          isActive
            ? "text-gray-200 border-b-2 border-gray-300 rounded-md"
            : "text-white rounded-md hover:bg-gradient-to-r hover:from-themeColor-600 hover:b ",
          "px-3  py-2 text-sm font-medium flex items-center gap-2 duration-150 ease-linear"
        )}
      >
        {icon}
        {name}
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
          className={classNames(
            "absolute top-full left-0 mt-5 bg-themeColor-900 text-white rounded-md shadow-lg overflow-hidden transition-all duration-500 ease-in-out",
            isOpen
              ? "opacity-100 visible animate-slide-down"
              : "opacity-0 invisible animate-slide-up"
          )}
        >
          {subItems.map((subItem, index) => (
            <Link
              key={index}
              to={subItem.link}
              onClick={() => {
                onClick(); // تحديث الحالة المطلوبة (مثل تغيير العنصر النشط)
                closeSubMenu(); // إغلاق القائمة الفرعية بعد النقر
              }}
              className="block px-4 py-2 text-base hover:bg-gradient-to-r hover:from-themeColor-500"
            >
              {subItem.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Navbar({ dark }) {
  const { t } = useI18nContext();
  const [role, setRole] = useState("admin");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSubMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const closeSubMenu = () => {
    setOpenMenuIndex(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // محتوى Sidebar الذي تم نقله ليصبح ضمن Navbar
  const navigationAdmin = [
    {
      icon: <House size={25} />,
      name: t("sideBar.dashboard"),
      link: `${import.meta.env.VITE_PUBLIC_URL}/`,
    },
    {
      icon: <UserCircleGear size={25} />,
      name: t("sideBar.registration"),
      link: `${import.meta.env.VITE_PUBLIC_URL}/registration`,
    },
    {
      icon: <UserCircleGear size={25} />,
      name: t("sideBar.departures"),
      link: `${import.meta.env.VITE_PUBLIC_URL}/departures`,
    },
    {
      icon: <Network size={32} />,
      name: t("sideBar.Administrative"),
      subItems: [
        { name: t("sideBar.Entities"), link: `${import.meta.env.VITE_PUBLIC_URL}/entities` },
        { name: t("sideBar.Employee"), link: `${import.meta.env.VITE_PUBLIC_URL}/employee` },
      ],
    },
    {
      icon: <Clock size={32} />,
      name: t("sideBar.Shifts"),
      link: `${import.meta.env.VITE_PUBLIC_URL}/shifts`,
    },

    {
      icon: <Gear size={32} />,
      name: t("sideBar.setting"),
      subItems: [
        { name: t("sideBar.site"), link: `${import.meta.env.VITE_PUBLIC_URL}/sites` },
        { name: t("sideBar.audio"), link: `${import.meta.env.VITE_PUBLIC_URL}/records` },
        { name: t("sideBar.reject"), link: `${import.meta.env.VITE_PUBLIC_URL}/rejected` },
        { name: t("sideBar.changeSetting"), link: `${import.meta.env.VITE_PUBLIC_URL}/account` },
        { name: t("sideBar.ComeSetting"), link: `${import.meta.env.VITE_PUBLIC_URL}/entities` },
      ],
    },

    {
      icon: <Gear size={32} />,
      name: t("sideBar.reports"),
      subItems: [
        { name: t("sideBar.site"), link: `${import.meta.env.VITE_PUBLIC_URL}/entities` },
        { name: t("sideBar.audio"), link: `${import.meta.env.VITE_PUBLIC_URL}/entities` },

      ],
    },

  ];

  const navigationError = [
    {
      icon: <Warning size={25} />,
      name: t("sideBar.error"),
      link: "/*",
    },
  ];

  const selectedNavigation = role === "admin" ? navigationAdmin : navigationError;

  const [activeIndex, setActiveIndex] = useState(
    selectedNavigation.findIndex((item) => item.link === `${import.meta.env.VITE_PUBLIC_URL}/`)
  );

  const handleItemClick = (index, link) => {
    setActiveIndex(index);
    localStorage.setItem("currentPath", link);
    setIsMobileMenuOpen(false); // إغلاق القائمة بعد اختيار العنصر

    // تمرير الصفحة إلى الأعلى بعد الانتقال إلى الرابط
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full text-white shadow-lg sticky top-0 z-50 bg-gradient-to-r from-themeColor-900 via-themeColor-800 to-themeColor-600">
      <nav className="flex items-center justify-between p-4 lg:justify-around">
        {/* زر القائمة للشاشات الصغيرة */}
        <div className="lg:hidden">
          <button onClick={toggleMobileMenu} className="text-white">
            {isMobileMenuOpen ? <X size={32} /> : <List size={32} />}
          </button>
        </div>

        {/* شعار التطبيق */}
        <div>
          <h1 className="text-2xl font-semibold">Tracker</h1>
        </div>

        {/* روابط القائمة الكبيرة */}
        <div
          className={classNames(
            "mt-3 lg:flex items-center space-x-6 transition-all duration-300 ease-in-out",
            isMobileMenuOpen
              ? "absolute top-full right-2 w-[40%] rounded-md p-4 lg:static lg:bg-transparent lg:w-auto lg:p-0 block animate-slide-down"
              : "hidden lg:block"
          )}
        >
          {selectedNavigation.map((item, index) => (
            <NavbarItem
              key={index}
              icon={item.icon}
              name={item.name}
              link={item.link}
              subItems={item.subItems}
              isOpen={openMenuIndex === index}
              toggleSubMenu={() => toggleSubMenu(index)}
              closeSubMenu={closeSubMenu}
              onClick={() => handleItemClick(index, item.link)}
            />
          ))}
        </div>

        {/* معلومات المستخدم */}
        <div className="flex items-center gap-4">
          <img
            src="https://avatars.githubusercontent.com/u/52693893?v=4"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <p className="font-semibold hidden md:block">Ahmed Al-Masri</p>
        </div>
      </nav>
    </div>
  );
}
