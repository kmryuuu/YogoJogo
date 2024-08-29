import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import AuthContext from "@/context/AuthContext";
import { db } from "@/utils/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import imgSuccess from "@/assets/images/image-success.png";

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
        navigate(`/payment/fail?code=${error.code}&message=${error.message}`);
      }
    }

    confirm();
  }, [searchParams, navigate, user, setCart, setSelectedItems]);

  return (
    <div
      className="flex h-screen flex-col items-center justify-center"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <img src={imgSuccess} alt="결제 완료 이미지" className="w-16" />
      <h2 className="mb-2 mt-4 text-2xl">결제를 완료했어요</h2>
      <p>안전하게 보내드릴게요 :)</p>
      <button
        onClick={() => navigate("/mypage/history")}
        className="mt-12 rounded-md px-20 py-3 font-bold"
        style={{ backgroundColor: "#FEEFE1", color: "#FF7A00" }}
      >
        주문 상세보기
      </button>
    </div>
  );
};

export default PaymentSuccess;
