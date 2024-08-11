import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import AuthContext from "@/context/AuthContext";

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

        if (!response.ok) {
          // PROVIDER_ERROR 발생 시 무시하고 결제 성공으로 처리
          if (json.code === "PROVIDER_ERROR") {
            console.warn("PROVIDER_ERROR 오류를 무시하고 승인으로 처리");
            return;
          }

          throw { message: json.message, code: json.code };
        }

        // 결제 성공 시 장바구니와 선택된 아이템 초기화
        setCart([]);
        setSelectedItems([]);
      } catch (error: any) {
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
