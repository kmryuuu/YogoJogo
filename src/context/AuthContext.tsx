import { createContext, ReactNode, useState, useEffect } from "react";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

interface AuthContextProps {
  user: User | null;
  signup: (email: string, password: string) => Promise<string | void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  resetError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthError {
  code: string;
  message: string;
}
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // 현재 사용자 상태 업데이트
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
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
      setUser(null);
    } catch (error) {
      alert("로그아웃에 실패하였습니다.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, error, signup, login, logout, resetError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthContext;
