import { useLocation } from "react-router-dom";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const withoutFooterPages = ["/login", "/signup", "/cart"];
  const isFullScreenPage = location.pathname === "/login";

  const containerClass = "min-h-screen flex flex-grow flex-col";
  const mainClass = isFullScreenPage
    ? "h-calc-100vh-192 flex flex-grow flex-col w-full"
    : "h-calc-100vh-192 flex flex-grow flex-col w-full max-w-screen-xl mx-auto";

  return (
    <div className={containerClass}>
      <div className="mx-auto w-full max-w-screen-xl">
        <Header />
      </div>
      <main className={mainClass}>
        <Outlet />
      </main>
      {!withoutFooterPages.includes(location.pathname) && <Footer />}
    </div>
  );
};

export default Layout;
