import { jwtDecode } from "jwt-decode";
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  element: Component,
  loginPath,
  roles = ["ROLE_CUSTOMER"],//, "ROLE_ADMIN"
}) => {
  try {
    const token = localStorage.getItem("token");

    // Check if token exists
    if (!token) {
      return <Navigate to={loginPath} />;
    }

    // Decode token and check role
    const decodedToken = jwtDecode(token);

    // console.log(decodedToken.roles, "roles");
    // Optional: Add token expiration check
    // const isTokenExpired = decodedToken.exp < Date.now() / 1000;
   
    // Optional: Add token expiration check (tolerate tokens without exp)
    const isTokenExpired = decodedToken?.exp && decodedToken.exp < Date.now() / 1000;

    if (isTokenExpired) {
      localStorage.removeItem("token");
      return <Navigate to={loginPath} />;
    }
    // Accept role in several common places: role, roles[], authorities[]
    const claimed = new Set(
      [
        decodedToken.role,
        ...(decodedToken.roles || []),
        ...(decodedToken.authorities || []),
      ].filter(Boolean)
    );
    const ok = roles.some((r) => claimed.has(r));
    // Strict role checking - only exact role match allowed
    return ok ? <Component /> : <Navigate to={loginPath} />;
  } catch (error) {
    // Handle decoding errors
    console.error("Token validation error:", error);
    localStorage.removeItem("token");
    return <Navigate to={loginPath} />;
  }
};

export default ProtectedRoute;
