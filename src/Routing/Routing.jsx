import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "../components/Authentication/SignUp";
import SignIn from "../components/Authentication/SignIn";
import NotFound from "../components/Authentication/NotFound";
import ProtectedRoute from "./ProtectedRoute";

import UserDashboard from "../components/Pages/UserPages/UserDashboard";








import AuthSuccess from "../components/Authentication/AuthSuccess";
import TermsOfService from "../components/Pages/terms";
import PrivacyPolicy from "../components/Pages/Privacy";
import Success from "../components/Pages/Success";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />}></Route>
      <Route path="/authSuccess" element={<AuthSuccess />}></Route>
      <Route path="/SignUp" element={<SignUp />}></Route>
      <Route path="/terms-of-service" element={<TermsOfService />}></Route>
      <Route path="/privacy-policy" element={<PrivacyPolicy />}></Route>

      <Route path="*" element={<NotFound />} />
    
    

      <Route
        path="/user/dashboard"
        element={<ProtectedRoute element={UserDashboard} loginPath="/" />}
      ></Route>


      <Route path="/success" element ={<ProtectedRoute element={Success} loginPath="/"/>}></Route>
    </Routes>
  );
};

export default Routing;
