import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRoutesProps {
  children: ReactNode;
}

const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
  const { user, loading } = useAuth();
  console.log("ProtectedRoutes user:", user);

  if (loading) {
    return <Spinner />;
  }

  // 사용자가 로그인되지 않은 경우
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 사용자가 로그인된 경우 요청한 페이지 렌더링
  return <>{children}</>;
};

export default ProtectedRoutes;
