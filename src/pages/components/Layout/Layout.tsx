import React from "react";
import Navbar from "../Navbar/Navbar";


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // useAuth(); // will implement later at end of tutorial

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
