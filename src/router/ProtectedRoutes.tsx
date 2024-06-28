import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

interface ProtectedRoutesProps {
  children: ReactNode;
}

const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
  const { user } = useAuth();

  if (!user) {
    // 사용자가 로그인되지 않은 경우 로그인 페이지로 리디렉션
    return <Navigate to="/login" replace />;
  }

  // 사용자가 로그인된 경우 요청한 페이지 렌더링
  return <>{children}</>;
};

export default ProtectedRoutes;
