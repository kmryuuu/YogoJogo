import { useLocation } from "react-router-dom";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const withoutFooterPages = [
    "/login",
    "/signup",
    "/cart",
    "/orders",
    "/orders/orderlist",
    "/orders/inventory",
    "/orders/create",
  ];
  const withoutHeaderPages = [
    "/orders",
    "/orders/orderlist",
    "/orders/inventory",
    "/orders/create",
  ];
  const fullScreenPages = [
    "/login",
    "/orders",
    "/orders/orderlist",
    "/orders/inventory",
    "/orders/create",
  ];
  const isFullScreenPage = fullScreenPages.includes(location.pathname);

  const containerClass = "min-h-screen flex flex-grow flex-col";
  const mainClass = isFullScreenPage
    ? "h-calc-100vh-192 flex flex-grow flex-col w-full"
    : "h-calc-100vh-192 flex flex-grow flex-col w-full max-w-screen-xl mx-auto";

  return (
    <div className={containerClass}>
      <div className="mx-auto w-full max-w-screen-xl">
        {!withoutHeaderPages.includes(location.pathname) && <Header />}
      </div>
      <main className={mainClass}>
        <Outlet />
      </main>
      {!withoutFooterPages.includes(location.pathname) && <Footer />}
    </div>
  );
};

export default Layout;
