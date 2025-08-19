import React from "react";
import authStore from "../store/store.js";
import { Navigate } from "react-router-dom";

const  Protected = ({ children }) => {
  const currentUser = authStore((state) => state.currentUser);
  if (currentUser) {
    return <Navigate to="/"></Navigate>;
  }
  return children;
};

export default Protected;
