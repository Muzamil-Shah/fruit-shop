"use client";
// YourBillingComponent.jsx
import Script from "next/script";
// import img from "/logo.png";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
export default function YourBillingComponent({
  total,
  setIsDialoadOpen,
  setIsPaid,
  setPaymentId,
}: {
  total: number;
  setIsDialoadOpen: (bool: boolean) => void;
  setIsPaid: (bool: boolean) => void;
  setPaymentId: (id: string | undefined) => void;
}) {
  const me = useQuery(api.users.getMe);
  const order = useAction(api.razorpay.order);
  const success = useAction(api.razorpay.success);

  const makePayment = async () => {
    // Make API call to the serverless API
    const result = await order({ total });
    if (!result) {
      alert("Server error. Are you online?");
      return;
    }
    setIsDialoadOpen(false);
    const { amount, id: order_id, currency } = result;
    if (me) {
      const options = {
        key: "rzp_test_wENBEAz3qyHtqJ", // Enter the Key ID generated from the Dashboard
        amount: amount.toString(),
        currency: currency,
        name: me?.name ?? "User",
        description: "Test Transaction",
        image: me?.image,
        order_id: order_id,
        handler: async function (response: any) {
          // alert(JSON.stringify(response));
          const data = {
            orderCreationId: order_id ?? "",
            razorpayPaymentId: response.razorpay_payment_id ?? "",
            razorpayOrderId: response.razorpay_order_id ?? "",
            razorpaySignature: response.razorpay_signature ?? "",
            userId: me?._id,
            amount: Number(amount),
          };

          const result = await success(data);
          if (result.msg === "success") {
            setIsPaid(true);
            setPaymentId(response?.razorpay_payment_id);
            console.log("success");
          }
        },
        prefill: {
          name: "<YOUR NAME>",
          email: "example@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Example Corporate Office",
        },
        theme: {
          color: "black",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.success", function (response: any) {
        setIsDialoadOpen(true);
      });
      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment failed. Please try again. Contact support for help");
      });
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <Button
        onClick={() => {
          makePayment();
        }}
      >
        Pay Now
      </Button>
    </>
  );
}
