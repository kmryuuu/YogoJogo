import { doc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import AuthContext from "@/context/AuthContext";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Product } from "@/interface/interface";

const clientKey = import.meta.env.VITE_TOSS_PAYMENT_CLIENT_KEY;
const originUrl = import.meta.env.VITE_ORIGIN_URL;

interface LocationState {
  selectedItems: Product[];
}

const Checkout = () => {
  const location = useLocation();
  const { selectedItems } = location.state as LocationState;
  const { user } = useContext(AuthContext);
  const [payment, setPayment] = useState<any>(null);

  const generateOrderId = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
    return Array.from({ length: 12 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");
  };

  const orderId = generateOrderId();

  const totalAmount = selectedItems.reduce(
    (total: number, item: Product) => total + item.price * item.quantity,
    0,
  );

  const orderName =
    selectedItems.length > 1
      ? `${selectedItems[0].title} 외 ${selectedItems.length - 1}건`
      : selectedItems[0].title;

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        console.log("tossPayments loaded:", tossPayments);
        console.log("selectedItems:", selectedItems);
        const paymentInstance = tossPayments.payment({
          customerKey: user?.uid || "",
        });
        setPayment(paymentInstance);
      } catch {
        console.log("fetchPayment 오류");
      }
    };
    if (user) {
      fetchPayment();
    }
  }, [user]);

  const handleCheckout = async () => {
    if (user) {
      // Firestore에 사용자 ID 문서에 각 주문을 저장
      await setDoc(doc(db, "orders", user.uid, "userOrders", orderId), {
        orderId,
        amount: totalAmount,
        orderName,
        items: selectedItems,
        status: "pending",
        createdAt: new Date(),
      });

      if (payment) {
        try {
          await payment.requestPayment({
            method: "CARD",
            amount: {
              value: totalAmount,
              currency: "KRW",
            },
            orderId,
            orderName,
            successUrl: `${originUrl}/orders/success`,
            failUrl: `${originUrl}/orders/fail`,
          });
        } catch (error) {
          console.error("Payment request failed:", error);
        }
      }
    } else {
      console.error("User ID not found");
    }
  };

  return (
    <div>
      <h1>결제 페이지</h1>
      <div>
        {selectedItems.map((item) => (
          <div key={item.id} className="flex">
            <img
              src={item.images[0]}
              className="h-20 w-20 rounded-md object-cover"
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
