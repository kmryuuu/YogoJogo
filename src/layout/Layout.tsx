import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="m-auto max-w-screen-lg">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
