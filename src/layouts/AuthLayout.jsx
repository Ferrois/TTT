import React from "react";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
// import { AuthModal } from "../Modal/AuthModal";

function AuthLayout() {
  return (
    <AuthProvider>
      {/* <AuthModal/> */}
      <Outlet />
    </AuthProvider>
  );
}

export { AuthLayout };