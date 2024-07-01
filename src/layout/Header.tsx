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
      <div className="flex h-16 w-full items-center justify-between px-4">
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
    </header>
  );
};

export default Header;
