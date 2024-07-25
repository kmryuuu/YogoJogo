import { useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import AuthContext from "@/context/AuthContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);

  const amount = searchParams.get("amount");
  const orderId = searchParams.get("orderId");
  const paymentKey = searchParams.get("paymentKey");

  useEffect(() => {
    const updateOrderStatus = async () => {
      if (user && orderId && amount && paymentKey) {
        try {
          await updateDoc(doc(db, "orders", user.uid, "userOrders", orderId), {
            status: "completed",
            paymentKey,
            completedAt: new Date(),
          });
          console.log("Order status updated to completed");
        } catch (error) {
          console.error("Failed to update order status:", error);
        }
      } else {
        console.error("Missing parameters:", {
          user,
          orderId,
          amount,
          paymentKey,
        });
      }
    };

    updateOrderStatus();
  }, [user, orderId, amount, paymentKey]);

  return (
    <div>
      <h2>결제가 완료되었습니다.</h2>
      <p>결제 금액</p>
      <div>{`${Number(amount).toLocaleString()}원`}</div>
      <p>주문 번호</p>
      <div> {`${searchParams.get("orderId")}`}</div>
    </div>
  );
};

export default PaymentSuccess;
