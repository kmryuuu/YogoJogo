import { Link } from "react-router-dom";
import LoginForm from "@/components/Form/LoginForm";

const Login = () => {
  return (
    <div className="bg-login flex h-full min-h-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center px-4">
        <h2 className="mb-8 text-2xl font-bold text-white">이메일로 로그인</h2>
        <LoginForm />
        <div className="flex gap-2 text-sm">
          <p className="text-white">아직 회원이 아니신가요?</p>
          <Link to="/signup" className="font-bold text-primary underline">
            회원가입
          </Link>
        </div>
        <button
          type="button"
          className="button-shape mt-12 w-full bg-buttonKakao font-bold"
        >
          카카오로 로그인
        </button>
      </div>
    </div>
  );
};

export default Login;
