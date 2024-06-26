import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface AuthError {
  code: string;
  message: string;
}

const errorMessage = (code: string) => {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-email":
    case "auth/invalid-credential":
    case "auth/weak-password":
      return "이메일 혹은 비밀번호가 일치하지 않습니다.";
    case "auth/email-already-in-use":
      return "이미 사용 중인 이메일입니다.";
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
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // 현재 사용자 업데이트
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 오류 초기화 함수
  const resetError = () => {
    setError(null);
  };

  // 회원가입
  const signup = async (email: string, password: string) => {
    console.log("회원가입 정보", email, password);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === "auth/email-already-in-use") {
        return "duplicate email";
      } else {
        setError(errorMessage(authError.code));
      }
    }
  };

  // 로그인
  const login = async (email: string, password: string) => {
    console.log("들어온 이메일, 비밀번호", email, password);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
      setError(null);
    } catch (error) {
      const authError = error as AuthError;
      setError(errorMessage(authError.code));
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      setUser(null);
    } catch (error) {
      console.log("로그아웃을 하지 못했습니다.");
    }
  };

  return { signup, login, logout, user, error, resetError };
};

export default useAuth;
