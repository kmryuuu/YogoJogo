import { useContext, useState } from "react";
import { useCart } from "@/context/CartContext";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import AuthContext from "@/context/AuthContext";
import { db } from "@/utils/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { SubmitHandler, useForm } from "react-hook-form";
import AddressSearch from "@/components/Address/AddressSearch";

interface OrderFormInputs {
  address: string;
}

const clientKey = import.meta.env.VITE_TOSS_PAYMENT_CLIENT_KEY;
const originUrl = import.meta.env.VITE_ORIGIN_URL;

const Checkout = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { selectedItems } = useCart();
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OrderFormInputs>({ mode: "onBlur" });

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

  const onSubmit: SubmitHandler<OrderFormInputs> = (data) => console.log(data);

  const handleAddressComplete = (data: any) => {
    setValue("address", data.address);
    setModalOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="my-6 text-2xl">주문/결제</h1>
      <div className="h-2 bg-gray-100"></div>
      <p className="mb-3 mt-6 text-lg font-bold">배송 정보</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="address" className="text-sm text-fontColor-darkGray">
          주소
        </label>
        <div className="flex justify-between">
          <input
            id="address"
            type="text"
            placeholder="주소 검색"
            className="form-input border"
            {...register("address", { required: "주소를 입력해 주세요." })}
          />
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="ml-2 w-20 rounded-lg bg-gray-600 text-white"
          >
            검색
          </button>
        </div>
        <input
          type="text"
          placeholder="상세주소를 입력해 주세요."
          className="form-input my-2 border"
        />
        {errors.address && (
          <p className="text-xs text-red-500">주소를 입력해 주세요.</p>
        )}
      </form>
      <AddressSearch
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onComplete={handleAddressComplete}
      />
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
