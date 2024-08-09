import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthContext from "@/context/AuthContext"; // 사용자 인증 컨텍스트

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext); // user 정보를 가져옵니다.
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    async function confirm() {
      const requestData = {
        orderId: searchParams.get("orderId"),
        amount: searchParams.get("amount"),
        paymentKey: searchParams.get("paymentKey"),
        userId: user?.uid, // userId를 requestData에 추가합니다.
      };

      console.log("Calling approvePayment API with:", requestData);

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
          console.error("approvePayment API error response:", json);
          throw { message: json.message, code: json.code };
        }

        setResponseData(json);
      } catch (error: any) {
        console.error("Error occurred during payment confirmation:", error);

        let errorMessage = "Unknown error occurred";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        navigate(
          `/payment/fail?code=${error.code}&message=${encodeURIComponent(errorMessage)}`,
        );
      }
    }

    confirm();
  }, [searchParams, navigate, user]); // user가 변할 때도 useEffect를 다시 실행하도록 합니다.

  return (
    <div>
      <h2>결제가 완료되었습니다.</h2>
      <p>주문 번호: {searchParams.get("orderId")}</p>
      <p>결제 금액: {Number(searchParams.get("amount")).toLocaleString()} 원</p>
      {responseData && (
        <div>
          <h3>Response Data:</h3>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
      <button onClick={() => navigate("/mypage/history")}>주문 상세보기</button>
    </div>
  );
};

export default PaymentSuccess;
