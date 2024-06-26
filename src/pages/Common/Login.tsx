import { Link } from "react-router-dom";
import LoginForm from "@/components/Form/LoginForm";

const Login = () => {
  return (
    <div className="justify-content flex flex-col items-center">
      <h2 className="text-2xl">이메일로 로그인</h2>
      <LoginForm />
      <div className="flex gap-2">
        <p>아직 회원이 아니신가요?</p>
        <Link to="/signup" className="underline">
          회원가입
        </Link>
      </div>
      <button type="button" className="bg-buttonKakao">
        카카오로 로그인
      </button>
    </div>
  );
};

export default Login;
