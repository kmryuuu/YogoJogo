import { useState } from "react";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

interface AuthError {
  code: string;
  message: string;
}

const errorMessage = (code: string) => {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/email-already-in-use":
    case "auth/invalid-email":
    case "auth/invalid-credential":
    case "auth/weak-password":
      return "이메일 혹은 비밀번호가 일치하지 않습니다.";
    case "auth/network-request-failed":
      return "네트워크 연결에 실패 하였습니다.";
    case "auth/internal-error":
      return "잘못된 요청입니다.";
    default:
      return "로그인에 실패 하였습니다.";
  }
};

const useAuth = () => {
  const [error, setError] = useState<string | null>(null);

  // 회원가입
  const signup = async (email: string, password: string) => {
    console.log("회원가입 정보", email, password);
    await createUserWithEmailAndPassword(auth, email, password);
    try {
    } catch (error) {
      const authError = error as AuthError;
      setError(errorMessage(authError.code));
    }
  };

  // 로그인
  const login = async (email: string, password: string) => {
    console.log("들어온 이메일, 비밀번호", email, password);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const authError = error as AuthError;
      setError(errorMessage(authError.code));
    }
  };

  return { signup, login, error };
};

export default useAuth;
