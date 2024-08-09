import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import * as cors from "cors";

admin.initializeApp();
const db = admin.firestore();

const corsHandler = cors({origin: true});

export const approvePayment = functions
  .runWith({
    timeoutSeconds: 300,
    memory: "256MB",
  })
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      const {paymentKey, orderId, amount, userId} = req.body;

      if (!paymentKey || !orderId || !amount || !userId) {
        functions.logger.error("Missing required parameters", {
          paymentKey,
          orderId,
          amount,
          userId,
        });
        res.status(400).send({error: "Missing required parameters"});
        return;
      }

      try {
        const apiSecretKey = functions.config().toss.secret;
        const encryptedApiSecretKey =
          "Basic " + Buffer.from(apiSecretKey + ":").toString("base64");

        const response = await fetch(
          "https://api.tosspayments.com/v1/payments/confirm",
          {
            method: "POST",
            headers: {
              "Authorization": encryptedApiSecretKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({paymentKey, orderId, amount}),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          functions.logger.error("Payment approval failed", result);
          res.status(response.status).json(result);
          return;
        }

        // Firestore 업데이트
        await db
          .collection("orders")
          .doc(userId)
          .collection("userOrders")
          .doc(orderId)
          .update({status: "completed"});

        res.status(200).json(result);
      } catch (error) {
        functions.logger.error("Payment approval error", error);
        res.status(500).send({error: "Payment approval error"});
      }
    });
  });
