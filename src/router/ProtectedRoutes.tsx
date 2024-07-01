import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRoutesProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoutes = ({
  children,
  adminOnly = false,
}: ProtectedRoutesProps) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  // 사용자가 로그인되지 않은 경우
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 관리자 전용 페이지, 관리자가 아닌 경우
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 사용자가 로그인된 경우 요청한 페이지 렌더링
  return <>{children}</>;
};

export default ProtectedRoutes;
