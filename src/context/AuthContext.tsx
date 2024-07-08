import { createContext, ReactNode, useState, useEffect } from "react";
import { auth, db } from "@/utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { UserInfo } from "@/interface/interface";

interface AuthContextProps {
  user: UserInfo | null;
  isAdmin: boolean;
  signup: (
    username: string,
    email: string,
    password: string,
  ) => Promise<string | void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string | null;
  resetError: () => void;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthError {
  code: string;
  message: string;
}

const initialState: AuthContextProps = {
  user: null,
  isAdmin: false,
  signup: () => Promise.resolve(undefined),
  login: () => Promise.resolve(false),
  logout: () => Promise.resolve(),
  error: null,
  resetError: () => {},
  loading: true,
};

const AuthContext = createContext<AuthContextProps>(initialState);

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
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // 현재 사용자 상태 업데이트
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: user.uid,
            name: userData.name,
            email: user.email,
            isAdmin: userData.isAdmin || false,
            createdAt: new Date(),
          });
          setIsAdmin(userData.isAdmin || false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 오류 초기화 함수
  const resetError = () => {
    setError(null);
  };

  // 회원가입
  const signup = async (username: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // firestore 유저 정보 저장
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), {
        username: username,
        email: userCredential.user.email,
        isAdmin: false,
        createdAt: new Date(),
      });
      alert("회원가입이 완료되었습니다. 로그인 후 이용해 주세요.");
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          uid: userCredential.user.uid,
          name: userData.name,
          email: userCredential.user.email,
          isAdmin: userData.isAdmin || false,
          createdAt: new Date(),
        });
        setIsAdmin(userData.isAdmin || false);
        setError(null);
        return true;
      } else {
        setError("사용자 정보를 찾을 수 없습니다.");
        return false;
      }
    } catch (error) {
      const authError = error as AuthError;
      console.log(authError);
      setError(errorMessage(authError.code));
      return false;
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      alert("로그아웃에 실패하였습니다.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        user,
        error,
        signup,
        login,
        logout,
        resetError,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthContext;
