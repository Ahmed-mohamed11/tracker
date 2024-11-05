import { Routes, Route, Navigate } from "react-router-dom";
import Error404Modern from "../pages/error/404-modern";
import { Suspense } from "react";
import RegistrationRequests from "../pages/Employee/RegisterEmployee";
import Departures from "../pages/Departures/Departures";
import Entities from "../pages/Entities/Entities";
import EmployeeStructure from "../pages/EmployeeStructure/EmployeeStructure";
import Shifts from "../pages/Shifts/calendar/calendar";
import Sites from "../pages/Sites/Sites";
import Records from "../pages/Records/Records";
import RejectedMovements from "../pages/RejectedMovements/RejectedMovements";
import AccountSetting from "../pages/AccountSetting/accountSetting";
import Companies from "../pages/Admin/Companies/Companies/Companies";
import Plans from "../pages/Admin/Plans/Plans/Plans";
import Branches from "../pages/Branch/Branch";
import Dashboard from "../pages/dashboard/Dashboard";
import Reports from "../pages/Reports/Reports";
import Login from "../pages/auth/login/Login";

const AdminPages = ({ loading }) => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route
          exact
          path={`${import.meta.env.VITE_PUBLIC_URL}/`}
          element={<Dashboard />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/registration`}
          element={<RegistrationRequests />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/companies`}
          element={<Companies />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/plans`}
          element={<Plans />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/departures`}
          element={<Departures />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/entities`}
          element={<Entities />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/reports`}
          element={<Reports />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/branches`}
          element={<Branches />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/employee`}
          element={<EmployeeStructure />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/shifts`}
          element={<Shifts />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/sites`}
          element={<Sites />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/records`}
          element={<Records />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/rejected`}
          element={<RejectedMovements />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/account`}
          element={<AccountSetting />}
        />

        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/registration`}
          element={<RegistrationRequests />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/companies`}
          element={<Companies />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/plans`}
          element={<Plans />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/departures`}
          element={<Departures />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/entities`}
          element={<Entities />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/entities`}
          element={<Entities />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/branches`}
          element={<Branches />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/employee`}
          element={<EmployeeStructure />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/shifts`}
          element={<Shifts />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/sites`}
          element={<Sites />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/records`}
          element={<Records />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/rejected`}
          element={<RejectedMovements />}
        />
        <Route
          path={`${import.meta.env.VITE_PUBLIC_URL}/account`}
          element={<AccountSetting />}
        />

        <Route path={"/*"} element={<Error404Modern />} />
      </Routes>
    </Suspense>
  );
};

export { AdminPages };
