import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import AuthContext from "@/context/AuthContext";
import imgFail from "@/assets/images/image-fail.png";

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
    <div
      className="flex flex-col items-center justify-center bg-gray-100"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="flex w-full max-w-md flex-col items-center rounded-lg bg-white py-8">
        <img src={imgFail} alt="결제 실패 이미지" className="w-16" />
        <h2 className="mb-2 mt-4 text-2xl">결제를 실패했어요</h2>
        <p>잠시후 재시도 해주세요.</p>
        <div className="mt-8 text-gray-500">
          <div className="flex justify-center">
            <p>에러 코드 : </p>
            <p className="pl-1">{searchParams.get("code")}</p>
          </div>
          <div className="flex justify-center">
            <p>에러 메세지 : </p>
            <p className="pl-1">{searchParams.get("message")}</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/cart")}
          className="mt-10 rounded-md px-20 py-3 font-bold"
          style={{ backgroundColor: "#FEEFE1", color: "#FF7A00" }}
        >
          장바구니로 이동
        </button>
      </div>
    </div>
  );
};

export default PaymentFail;
