import React from "react";
import pageNotFound from "../assets/page-not-found.png";

export const PageNotFound = () => {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <img src={pageNotFound} alt="page-not-found" />
    </div>
  );
};
