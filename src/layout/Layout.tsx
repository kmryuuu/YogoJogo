import { useLocation } from "react-router-dom";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const withoutFooterPages = [
    "/login",
    "/signup",
    "/admin",
    "/admin/orderlist",
    "/admin/inventory",
    "/admin/create",
  ];
  const withoutHeaderPages = [
    "/admin",
    "/admin/orderlist",
    "/admin/inventory",
    "/admin/create",
  ];
  const fullScreenPages = [
    "/",
    "/login",
    "/admin",
    "/admin/orderlist",
    "/admin/inventory",
    "/admin/create",
  ];

  const isWithoutFooterPage = withoutFooterPages.some(
    (path) => location.pathname === path,
  );
  const isWithoutHeaderPage = withoutHeaderPages.some(
    (path) => location.pathname === path,
  );
  const isFullScreenPage = fullScreenPages.some(
    (path) => location.pathname === path,
  );

  const containerClass = "min-h-screen flex flex-col";
  const mainClass = isFullScreenPage
    ? "flex-grow flex flex-col w-full"
    : "flex-grow flex flex-col w-full max-w-screen-lg mx-auto";

  return (
    <div className={containerClass}>
      {!isWithoutHeaderPage && (
        <div className="w-full">
          <Header />
        </div>
      )}
      <main className={mainClass}>
        <Outlet />
      </main>
      {!isWithoutFooterPage && (
        <div className="w-full">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Layout;
