import { Routes, Route } from "react-router-dom";
import Error404Modern from "../pages/error/404-modern";
import { Suspense } from "react";
 import RegistrationRequests from "../pages/registration/RegistrationRequests";
 


const AdminPages = ({ loading }) => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route
          exact
          path={`${import.meta.env.VITE_PUBLIC_URL}/`}
          element={<div>ServerDash</div>}
        />
        <Route path={`${import.meta.env.VITE_PUBLIC_URL}/registration`}  element={<RegistrationRequests />} />

        

        <Route path={"/*"} element={<Error404Modern />} />
      </Routes>
    </Suspense>
  );
};

export { AdminPages };