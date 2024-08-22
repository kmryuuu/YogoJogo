import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import AuthContext from "@/context/AuthContext";

const PaymentFail = () => {
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const updatePaymentStatus = async () => {
      const orderId = searchParams.get("orderId");
      const errorMessage = searchParams.get("message");

      if (user && orderId) {
        // Firestore에서 해당 주문의 상태를 "failed"로 업데이트
        await updateDoc(doc(db, "orders", user.uid, "userOrders", orderId), {
          status: "failed",
          errorMessage: errorMessage || "결제를 실패하였습니다.",
        });
      }
    };

    updatePaymentStatus();
  }, [searchParams, user]);

  return (
    <div>
      <h2>결제 실패</h2>
      <p>{searchParams.get("message") || "결제 중 오류가 발생하였습니다."}</p>
      <button onClick={() => navigate("/cart")}>장바구니로 이동</button>
    </div>
  );
};

export default PaymentFail;
