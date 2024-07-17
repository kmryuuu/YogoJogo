import { Link, useNavigate } from "react-router-dom";
import IconMyPage from "@/assets/icons/mypage.svg";
import IconCart from "@/assets/icons/cart.svg";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useContext(AuthContext);

  const categoryMap: { [key: string]: string } = {
    "전체상품": "allproducts",
    "제철상품": "seasonal",
    "과일": "fruits",
    "채소": "vegetables",
    "축산": "meat",
    "수산": "seafood",
  };

  const categories = Object.keys(categoryMap);

  const handleLogout = async () => {
    await logout();
    navigate("/"); // 로그아웃 후 홈 페이지로 이동
  };

  const handleLogin = () => {
    navigate("/login"); // 로그인 페이지로 이동
  };

  const showCategories =
    location.pathname === "/" ||
    location.pathname.startsWith("/product/") ||
    location.pathname.startsWith("/category/");

  return (
    <header>
      <div className="mx-auto flex h-16 w-full max-w-screen-lg items-center justify-between">
        <div>
          <Link to="/">
            <h1>LOGO</h1>
          </Link>
        </div>
        <nav>
          <ul className="flex items-center gap-6 text-xs text-fontColor-darkGray">
            {isAdmin ? (
              <li>
                <Link to="/orders">
                  <span>관리자 모드</span>
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/cart">
                    <IconCart />
                  </Link>
                </li>
                <li>
                  <Link to="/mypage">
                    <IconMyPage />
                  </Link>
                </li>
              </>
            )}
            <li>
              {user ? (
                <button onClick={handleLogout}>로그아웃</button>
              ) : (
                <button onClick={handleLogin}>로그인</button>
              )}
            </li>
          </ul>
        </nav>
      </div>
      {showCategories && (
        <div className="w-full border-b border-t">
          <nav className="mx-auto max-w-screen-lg py-3">
            <ul className="flex items-center gap-8 text-sm text-gray-500">
              {categories.map((category) => (
                <li key={category}>
                  <Link to={`/category/${categoryMap[category]}`}>
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
