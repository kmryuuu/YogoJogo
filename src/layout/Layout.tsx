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

  // 동적 경로도 확인할 수 있도록 includes 사용
  const isWithoutFooterPage = withoutFooterPages.some((path) =>
    location.pathname.includes(path),
  );
  const isWithoutHeaderPage = withoutHeaderPages.some((path) =>
    location.pathname.includes(path),
  );
  const isFullScreenPage = fullScreenPages.some((path) =>
    location.pathname.includes(path),
  );

  const containerClass = "min-h-screen flex flex-grow flex-col";
  const mainClass = isFullScreenPage
    ? "h-calc-100vh-192 flex flex-grow flex-col w-full"
    : "h-calc-100vh-192 flex flex-grow flex-col w-full max-w-screen-xl mx-auto";

  return (
    <div className={containerClass}>
      <div className="mx-auto w-full max-w-screen-xl">
        {!isWithoutHeaderPage && <Header />}
      </div>
      <main className={mainClass}>
        <Outlet />
      </main>
      {!isWithoutFooterPage && <Footer />}
    </div>
  );
};

export default Layout;
