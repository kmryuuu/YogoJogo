import { Link } from "react-router-dom";
import IconMyPage from "@/assets/icons/mypage.svg";
import IConCart from "@/assets/icons/cart.svg";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

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
            <ul className="flex items-center gap-6 text-xs text-gray-500">
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
                <button onClick={logout}>로그아웃</button>
              </li>
            </ul>
          </nav>
        ) : (
          <nav>
            {/* 비로그인 시 */}
            <ul className="flex items-center gap-6 text-xs text-gray-500">
              <li>
                <Link to="/cart">
                  <IConCart />
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
