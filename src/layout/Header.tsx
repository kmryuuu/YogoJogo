import { Link } from "react-router-dom";
import IconMyPage from "@/assets/icons/mypage.svg";
import IConCart from "@/assets/icons/cart.svg";

const Header = () => {
  return (
    <header>
      <div className="flex">
        <div>
          <Link to="/">
            <h1>LOGO</h1>
          </Link>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/login">
                <span>로그인</span>
              </Link>
            </li>
            <li>
              <Link to="/mypage">
                <IconMyPage />
              </Link>
            </li>
            <li>
              <Link to="/cart">
                <IConCart />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
