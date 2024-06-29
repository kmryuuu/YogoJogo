import { Link, useNavigate } from "react-router-dom";
import IconMyPage from "@/assets/icons/mypage.svg";
import IConCart from "@/assets/icons/cart.svg";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // 로그아웃 후 홈 페이지로 이동
  };

  return (
    <header>
      <div className="flex h-16 w-full items-center justify-between px-4">
        <div>
          <Link to="/">
            <h1>LOGO</h1>
          </Link>
        </div>
        {user ? (
          <nav>
            {/* 로그인 시 */}
            <ul className="flex items-center gap-6 text-xs text-fontColor-darkGray">
              <li>
                <Link to="/cart">
                  <IConCart />
                </Link>
              </li>
              <li>
                <Link to="/mypage">
                  <IconMyPage />
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>로그아웃</button>
              </li>
            </ul>
          </nav>
        ) : (
          <nav>
            {/* 비로그인 시 */}
            <ul className="flex items-center gap-6 text-xs text-fontColor-darkGray">
              <li>
                <Link to="/cart">
                  <IConCart />
                </Link>
              </li>
              <li>
                <Link to="/mypage">
                  <IconMyPage />
                </Link>
              </li>
              <li>
                <Link to="/login">
                  <span>로그인</span>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
