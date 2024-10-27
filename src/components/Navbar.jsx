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
  SignOut,
  User,
} from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useI18nContext } from "../context/i18n-context";
import Cookies from "js-cookie"; // استيراد مكتبة js-cookie
import { ListChecks } from "lucide-react";

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
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        closeSubMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

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
            : "text-white rounded-md hover:bg-gradient-to-r hover:from-themeColor-600",
          "px-3 py-2 text-sm font-medium flex items-center gap-2 duration-150 ease-linear"
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
            "absolute z-50 top-full left-0 mt-5 bg-themeColor-700 text-white rounded-md shadow-lg overflow-hidden transition-all duration-500 ease-in-out",
            isOpen
              ? "opacity-100 visible w-full animate-slide-down" // إضافة w-full لجعل القائمة بحجم الزر
              : "opacity-0 invisible w-full animate-slide-up" // إضافة w-full هنا أيضاً
          )}
        >
          {subItems.map((subItem, index) => (
            <Link
              key={index}
              to={subItem.link}
              onClick={() => {
                onClick();
                closeSubMenu();
              }}
              className="block px-4 py-2 text-base hover:bg-gradient-to-r hover:from-themeColor-400"
            >
              {subItem.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Navbar() {
  const { t } = useI18nContext();
  const [role, setRole] = useState("admin");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (!token || !storedUser) {
      navigate("/login");
    }

  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSubMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const closeSubMenu = () => {
    setOpenMenuIndex(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    // إزالة التوكن من الكوكيز
    Cookies.remove("token", { path: "/" }); // حذف التوكن مع تحديد نفس المسار
    localStorage.removeItem("user");

    // إعادة التوجيه إلى صفحة تسجيل الدخول بعد تسجيل الخروج
    navigate("/login");
  };







  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  const navigationAdmin = [
    userData && userData.isAdmin && {
      icon: <UserCircleGear size={25} />,
      name: t("sideBar.admin"),
      subItems: [
        {
          name: t("sideBar.companies"),
          link: `${import.meta.env.VITE_PUBLIC_URL}/companies`,
        },
        {
          name: t("sideBar.plans"),
          link: `${import.meta.env.VITE_PUBLIC_URL}/plans`,
        },
      ],
    },
    {
      icon: <House size={25} />,
      name: t("sideBar.dashboard"),
      link: `${import.meta.env.VITE_PUBLIC_URL}/`,
    },
    {
      icon: <ListChecks size={25} />,
      name: t("sideBar.registration"),
      link: `${import.meta.env.VITE_PUBLIC_URL}/registration`,
    },
    {
      icon: <UserCircleGear size={25} />,
      name: t("sideBar.departures"),
      link: `${import.meta.env.VITE_PUBLIC_URL}/departures`,
    },
    {
      icon: <Network size={25} />,
      name: t("sideBar.Administrative"),
      subItems: [
        {
          name: t("sideBar.Entities"),
          link: `${import.meta.env.VITE_PUBLIC_URL}/entities`,
        },

        {
          name: t("sideBar.branches"),
          link: `${import.meta.env.VITE_PUBLIC_URL}/branches`,
        },
        {
          name: t("sideBar.Employee"),
          link: `${import.meta.env.VITE_PUBLIC_URL}/employee`,
        },
      ],
    },
    {
      icon: <Clock size={25} />,
      name: t("sideBar.Shifts"),
      link: `${import.meta.env.VITE_PUBLIC_URL}/shifts`,
    },
    {
      icon: <Gear size={25} />,
      name: t("sideBar.setting"),
      subItems: [
        {
          name: t("sideBar.site"),
          link: `${import.meta.env.VITE_PUBLIC_URL}/sites`,
        },
        {
          name: t("sideBar.audio"),
          link: `${import.meta.env.VITE_PUBLIC_URL}/records`,
        },
        {
          name: t("sideBar.reject"),
          link: `${import.meta.env.VITE_PUBLIC_URL}/rejected`,
        },
        {
          name: t("sideBar.changeSetting"),
          link: `${import.meta.env.VITE_PUBLIC_URL}/account`,
        },
        {
          name: t("sideBar.ComeSetting"),
          link: `${import.meta.env.VITE_PUBLIC_URL}/entities`,
        },
      ],
    },
  ].filter(Boolean);

  const navigationError = [
    {
      icon: <Warning size={25} />,
      name: t("sideBar.error"),
      link: "/*",
    },
  ];

  const selectedNavigation =
    role === "admin" ? navigationAdmin : navigationError;

  const [activeIndex, setActiveIndex] = useState(
    selectedNavigation.findIndex(
      (item) => item.link === `${import.meta.env.VITE_PUBLIC_URL}/`
    )
  );

  const handleItemClick = (index, link) => {
    setActiveIndex(index);
    localStorage.setItem("currentPath", link);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full  text-white shadow-lg sticky top-0 z-50 bg-gradient-to-r from-themeColor-700 via-themeColor-600 to-themeColor-500">
      <nav className="flex items-center justify-around p-4 ">
        {/* زر القائمة للشاشات الصغيرة */}
        <div className="lg:hidden">
          <button onClick={toggleMobileMenu} className="text-white">
            {isMobileMenuOpen ? <X size={32} /> : <List size={32} />}
          </button>
        </div>

        {/* شعار التطبيق */}
        <div>
          <img
            className="w-14 h-14 border-2 border-orange-500 rounded-full"
            src="/SiteLogo.png"
            alt=""
          />
        </div>

        {/* روابط القائمة الكبيرة */}
        <div
          className={classNames(
            "mt-3 lg:flex items-center space-x-6 transition-all duration-300 ease-in-out hidden "
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
        <div className="relative" ref={userMenuRef}>
          <div
            className=" p-2 rounded-full flex items-center gap-3 cursor-pointer"
            onClick={toggleUserMenu}
          >
            {userData && userData.companyLogo && (
              <div>
                <img
                  src={userData.companyLogo}
                  alt={userData.companyName}
                  className="w-10 h-10 border-2 border-orange-500 rounded-full"
                />
                <span className="text-sm font-semibold">{userData && userData.companyName}</span>
              </div>
            )}

          </div>

          {isUserMenuOpen && (
            <div
              className={classNames(
                "absolute z-50 left-0 mt-7  w-48 bg-themeColor-900 text-white rounded-md shadow-lg overflow-hidden transition-all duration-500 ease-in-out",
                isUserMenuOpen
                  ? "opacity-100 visible animate-slide-down"
                  : "opacity-0 invisible animate-slide-up"
              )}
            >
              {userData && userData.email && (
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 hover:bg-gradient-to-r hover:from-themeColor-500"
                >
                  <User size={25} className="mx-2" />
                  {userData && userData.email}
                </Link>
              )}
              <Link
                to="/settings"
                className="flex items-center px-4 py-2 hover:bg-gradient-to-r hover:from-themeColor-500"
              >
                <Gear size={20} className=" mx-2" />
                إعدادات
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 hover:bg-gradient-to-r hover:from-themeColor-500 text-left"
              >
                <SignOut size={20} className="mx-2" />
                تسجيل خروج
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* القائمة المنسدلة للشاشات الصغيرة */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-themeColor-900 text-white shadow-lg rounded-md p-4 absolute w-[70%] ">
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
      )}
    </div>
  );
}
