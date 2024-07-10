import { Link, useNavigate } from "react-router-dom";
import IconMyPage from "@/assets/icons/mypage.svg";
import IconCart from "@/assets/icons/cart.svg";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const Header = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // 로그아웃 후 홈 페이지로 이동
  };

  const handleLogin = () => {
    navigate("/login"); // 로그인 페이지로 이동
  };

  return (
    <header>
      <div className="mx-auto flex h-16 w-full max-w-screen-xl items-center justify-between">
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
      <div className="w-full border-b border-t">
        <nav className="mx-auto max-w-screen-xl py-3">
          <ul className="flex items-center gap-8 text-sm text-gray-500">
            <li>
              <Link to="/category/allproducts">전체 상품</Link>
            </li>
            <li>
              <Link to="/category/seasonal">제철 음식</Link>
            </li>
            <li>
              <Link to="/category/fruits">과일</Link>
            </li>
            <li>
              <Link to="/category/vegetables">채소</Link>
            </li>
            <li>
              <Link to="/category/meat">축산 ・ 정육</Link>
            </li>
            <li>
              <Link to="/category/seafood">수산 ・ 해산</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
