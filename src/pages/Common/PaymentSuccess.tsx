import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import AuthContext from "@/context/AuthContext";
import { db } from "@/utils/firebase";
import { doc, deleteDoc } from "firebase/firestore";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const { setCart, setSelectedItems } = useCart();

  useEffect(() => {
    async function confirm() {
      const requestData = {
        orderId: searchParams.get("orderId"),
        amount: searchParams.get("amount"),
        paymentKey: searchParams.get("paymentKey"),
        userId: user?.uid,
      };

      try {
        const response = await fetch(
          "https://us-central1-yogojogo-e33a0.cloudfunctions.net/approvePayment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          },
        );

        const json = await response.json();

        if (response.ok) {
          // Firestore에서 장바구니 초기화
          if (user) {
            await deleteDoc(doc(db, "carts", user.uid));
          }
          setCart([]);
          setSelectedItems([]);
          localStorage.removeItem("cart");
        } else {
          // 테스트 결제에서 PROVIDER_ERROR 오류 무시
          if (json.code === "PROVIDER_ERROR") {
            console.warn(
              "테스트 결제 시 PROVIDER_ERROR 오류를 무시하고 승인으로 처리",
            );
            return;
          }
          throw { message: json.message, code: json.code };
        }
      } catch (error: any) {
        console.log("Caught error:", error);
        let errorMessage = "결제 중 오류가 발생하였습니다.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        navigate(
          `/payment/fail?code=${error.code}&message=${encodeURIComponent(errorMessage)}`,
        );
      }
    }

    confirm();
  }, [searchParams, navigate, user, setCart, setSelectedItems]);

  return (
    <div>
      <h2>결제가 완료되었습니다.</h2>
      <p>주문 번호: {searchParams.get("orderId")}</p>
      <p>결제 금액: {Number(searchParams.get("amount")).toLocaleString()} 원</p>
      <button onClick={() => navigate("/mypage/history")}>주문 상세보기</button>
    </div>
  );
};

export default PaymentSuccess;
