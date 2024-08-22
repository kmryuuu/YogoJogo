import { useContext } from "react";
import { useCart } from "@/context/CartContext";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import AuthContext from "@/context/AuthContext";
import { db } from "@/utils/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";

const clientKey = import.meta.env.VITE_TOSS_PAYMENT_CLIENT_KEY;
const originUrl = import.meta.env.VITE_ORIGIN_URL;

const Checkout = () => {
  const { selectedItems } = useCart();
  const { user } = useContext(AuthContext);

  const validSelectedItems = selectedItems.filter((item) => item);

  const totalAmount = validSelectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const orderName =
    validSelectedItems.length > 1
      ? `${validSelectedItems[0]?.title} 외 ${validSelectedItems.length - 1}건`
      : validSelectedItems[0]?.title;

  const handleCheckout = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const tossPayments = await loadTossPayments(clientKey);
    const payment = tossPayments.payment({
      customerKey: user?.uid || "",
    });

    const orderId = generateRandomString();

    try {
      // 결제 정보를 먼저 서버에 저장
      await setDoc(doc(db, "orders", user.uid, "userOrders", orderId), {
        orderId,
        amount: totalAmount,
        orderName,
        items: selectedItems,
        status: "pending",
        createdAt: new Date(),
      });

      await payment.requestPayment({
        method: "CARD",
        amount: {
          value: totalAmount,
          currency: "KRW",
        },
        orderId,
        orderName,
        successUrl: `${originUrl}/payment/success`,
        failUrl: `${originUrl}/payment/fail`,
        card: {
          useEscrow: false,
          flowMode: "DEFAULT",
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (error) {
      // 결제 실패 시 Firestore 업데이트
      await updateDoc(doc(db, "orders", user.uid, "userOrders", orderId), {
        status: "failed",
      });
    }
  };

  return (
    <div>
      <h1>결제 페이지</h1>
      <div>
        {validSelectedItems.map((item) => (
          <div key={item.id} className="flex">
            <img
              src={item.images[0]}
              className="h-20 w-20 rounded-md object-cover"
              alt={item.title}
            />
            <div>
              <p>{item.title}</p>
              <p>수량 {item.quantity}</p>
              <p>{item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <p>총 결제 금액: {totalAmount.toLocaleString()} 원</p>
      <button onClick={handleCheckout}>결제하기</button>
    </div>
  );
};

export default Checkout;

const generateRandomString = () => {
  return window.btoa(Math.random().toString()).slice(0, 20);
};
