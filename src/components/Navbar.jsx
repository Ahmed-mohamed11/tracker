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
  ListDashes,
} from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useI18nContext } from "../context/i18n-context";
import Cookies from "js-cookie";
import { Flag, ListChecks, Settings } from "lucide-react";
import AccountSettings from "../pages/AccountSetting/accountSetting";
import axios from "axios";

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSubMenu]);

  const isActive =
    location.pathname === link ||
    (subItems && subItems.some((sub) => location.pathname === sub.link));

  const handleClick = () => {
    if (subItems) toggleSubMenu();
    else onClick && onClick(); // Ensure onClick is defined before calling it
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
            className={`transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <CaretDown size={20} />
          </div>
        )}
      </Link>

      {subItems && (
        <div
          className={classNames(
            "absolute sm:right-32 sm:top-5 z-50 xl:top-full xl:right-0 mt-5 bg-themeColor-700 text-white rounded-md shadow-lg overflow-hidden transition-all duration-500 ease-in-out",
            isOpen
              ? "opacity-100 visible animate-slide-down"
              : "opacity-0 invisible animate-slide-up",
            "min-w-max" // Add this class to make the dropdown adapt to its content width
          )}
        >
          {subItems.map((subItem, index) => (
            <Link
              key={index}
              to={subItem.link}
              onClick={() => {
                subItem.onClick && subItem.onClick(); // Ensure subItem.onClick is defined
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

export default function Navbar({
  companyLogo,
  companyName,
  subscriptionWarning,
}) {
  const { t } = useI18nContext();
  const [role, setRole] = useState("admin");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const userMenuRef = useRef();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) setUser(JSON.parse(storedUser));
    else {
      Cookies.remove("token");
      localStorage.removeItem("user");
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSubMenu = (index) =>
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  const closeSubMenu = () => setOpenMenuIndex(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    localStorage.removeItem("user");
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
    userData &&
      userData.isAdmin && {
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
      icon: <ListDashes size={25} />,
      name: t("sideBar.EmployeesRequests"),
      link: `${import.meta.env.VITE_PUBLIC_URL}/AllEmployees`,
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
      icon: <Flag size={25} />,
      name: t("sideBar.reports"),
      subItems: [
        {
          name: t("sideBar.Preparation"),
          link: `${import.meta.env.VITE_PUBLIC_URL}/reports`,
        },
        {
          name: t("sideBar.DailyMovement"),
          link: `${import.meta.env.VITE_PUBLIC_URL}/dailyMovement`,
        },
        {
          name: t("sideBar.EmployeeRequestsReports"),
          link: `${import.meta.env.VITE_PUBLIC_URL}/employeeRequestsReports`,
        },
      ],
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
          onClick: () => setShowSettingsPopup(true),
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
  const [previewImage, setPreviewImage] = useState(null);
  const [originalLogo, setOriginalLogo] = useState(""); // Store the original logo

  const selectedNavigation =
    role === "admin" ? navigationAdmin : navigationError;
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.error("No token found in cookies");
          return;
        }
        const response = await axios.get(
          "https://bio.skyrsys.com/api/company/company-data/",
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const companyData = response.data;
        const { company_logo } = companyData;

        setPreviewImage(`https://bio.skyrsys.com${company_logo}`); // Set preview image
      } catch (error) {
        console.error("Error fetching company data", error);
      }
    };

    fetchCompanyData();
  }, []);
  return (
    <div className="w-full text-white shadow-lg sticky top-0 z-50 bg-gradient-to-r from-themeColor-700 via-themeColor-600 to-themeColor-500">
      {subscriptionWarning && (
        <div className="bg-yellow-200 text-yellow-800 p-4 text-center">
          ⚠️ تنبيه: ينتهي الاشتراك خلال أسبوع. يرجى التواصل مع الدعم لتجديد
          الاشتراك لضمان استمرار الخدمة.
        </div>
      )}
      <nav className="flex items-center justify-around p-4">
        <div className="xl:hidden">
          <button onClick={toggleMobileMenu} className="text-white">
            {isMobileMenuOpen ? <X size={32} /> : <List size={32} />}
          </button>
        </div>
        <div>
          <img
            className="w-14 h-14 border-2 border-orange-500 rounded-full"
            src="/SiteLogo.png"
            alt=""
          />
        </div>
        <div className={classNames("mt-3 xl:flex items-center hidden")}>
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
              onClick={() => {
                item.onClick && item.onClick();
              }} // Close the mobile menu after clicking
            />
          ))}
        </div>

        <div className="relative" ref={userMenuRef}>
          <div
            className=" rounded-full border-2 border-orange-500 flex items-center gap-3 cursor-pointer"
            onClick={toggleUserMenu}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Company Logo"
                className="w-12 h-12  rounded-full"
              />
            ) : (
              <img
                src={`https://bio.skyrsys.com${originalLogo}`}
                alt="Company Logo"
                className="w-12 h-12  rounded-full"
              />
            )}
          </div>

          {isUserMenuOpen && (
            <div
              ref={userMenuRef}
              className="absolute left-0 top-16 bg-themeColor-600 shadow-lg rounded-md w-48 py-2 z-50"
            >
              <button
                onClick={() => setShowSettingsPopup(true)}
                className=" w-full text-right px-4 py-2 text-white hover:bg-themeColor-500"
              >
                <Settings className="inline-block mr-2" />
                اعدادات حساب
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-right px-4 py-2 text-white hover:bg-gray-100"
              >
                <SignOut className="inline-block mr-2" />
                تسجيل خروج
              </button>
            </div>
          )}
        </div>
        {showSettingsPopup && (
          <AccountSettings onClose={() => setShowSettingsPopup(false)} />
        )}
      </nav>
      {isMobileMenuOpen && (
        <div className="xl:hidden p-3 bg-black bg-opacity-50 z-40">
          <div
            className={`flex flex-col items-start space-y-4 transition-transform duration-300 ease-in-out transform ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{
              transform: isMobileMenuOpen
                ? "translateX(0)"
                : "translateX(100%)",
            }}
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
                onClick={() => {
                  item.onClick && item.onClick();
                  setIsMobileMenuOpen(false); // Close the mobile menu when the main link is clicked
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
